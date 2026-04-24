// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"
import { marked } from "marked"
import DOMPurify from "dompurify"

const marqueeControllers = new Map()

function normalizePosition(position, segmentWidth) {
	if (segmentWidth <= 0) {
		return position
	}

	while (position <= -segmentWidth) {
		position += segmentWidth
	}

	while (position > 0) {
		position -= segmentWidth
	}

	return position
}

function setupTrackMarquee(track) {
	if (marqueeControllers.has(track)) {
		return
	}

	const direction = Number(track.dataset.direction || -1)
	const baseSpeed = Number(track.dataset.speed || 110)

	const segmentWidth = () => track.scrollWidth / 3

	let targetVelocity = direction * baseSpeed
	let velocity = targetVelocity
	let lastFrameTime = 0
	let position = direction > 0 ? -segmentWidth() : 0
	let hoveredCards = 0
	const cards = Array.from(track.querySelectorAll(".polaroid"))

	position = normalizePosition(position, segmentWidth())
	track.style.transform = `translateX(${position}px)`

	const stop = () => {
		targetVelocity = 0
	}

	const resume = () => {
		targetVelocity = direction * baseSpeed
	}

	const onLeave = () => {
		if (hoveredCards === 0 && !track.matches(":focus-within")) {
			resume()
		}
	}

	const onCardEnter = () => {
		hoveredCards += 1
		stop()
	}

	const onCardLeave = () => {
		hoveredCards = Math.max(hoveredCards - 1, 0)
		onLeave()
	}

	const onResize = () => {
		position = normalizePosition(position, segmentWidth())
		track.style.transform = `translateX(${position}px)`
	}

	const controller = {
		frameId: 0,
		stop,
		onLeave,
		onResize,
		onCardEnter,
		onCardLeave,
		cards
	}

	const tick = (timestamp) => {
		if (lastFrameTime === 0) {
			lastFrameTime = timestamp
		}

		const deltaSeconds = Math.min((timestamp - lastFrameTime) / 1000, 0.05)
		lastFrameTime = timestamp

		// Exponential smoothing makes deceleration and acceleration feel natural.
		const smoothing = 1 - Math.exp(-6 * deltaSeconds)
		velocity += (targetVelocity - velocity) * smoothing

		position += velocity * deltaSeconds
		position = normalizePosition(position, segmentWidth())
		track.style.transform = `translateX(${position}px)`

		controller.frameId = requestAnimationFrame(tick)
	}

	cards.forEach((card) => {
		card.addEventListener("pointerenter", onCardEnter)
		card.addEventListener("pointerleave", onCardLeave)
	})
	track.addEventListener("focusin", stop)
	track.addEventListener("focusout", onLeave)
	window.addEventListener("resize", onResize)

	controller.frameId = requestAnimationFrame(tick)
	marqueeControllers.set(track, controller)
}

function setupMarquees() {
	document.querySelectorAll(".track[data-direction]").forEach(setupTrackMarquee)
}

function teardownMarquees() {
	marqueeControllers.forEach((controller, track) => {
		cancelAnimationFrame(controller.frameId)
		controller.cards.forEach((card) => {
			card.removeEventListener("pointerenter", controller.onCardEnter)
			card.removeEventListener("pointerleave", controller.onCardLeave)
		})
		track.removeEventListener("focusin", controller.stop)
		track.removeEventListener("focusout", controller.onLeave)
		window.removeEventListener("resize", controller.onResize)
	})

	marqueeControllers.clear()
}

function setupDocsBrowser() {
	const root = document.querySelector("[data-docs-browser]")
	if (!root || root.dataset.bound === "true") {
		return
	}

	const tabs = Array.from(root.querySelectorAll("[data-doc-tab]"))
	const titleNode = root.querySelector("[data-doc-title]")
	const contentNode = root.querySelector("[data-doc-content]")
	const dataNode = root.querySelector("[data-documents-json]")

	if (tabs.length === 0 || !titleNode || !contentNode || !dataNode) {
		return
	}

	let documents
	try {
		documents = JSON.parse(dataNode.textContent || "[]")
	} catch (_error) {
		documents = []
	}

	if (!Array.isArray(documents) || documents.length === 0) {
		contentNode.innerHTML = "<p>No documentation files are available.</p>"
		return
	}

	marked.setOptions({
		gfm: true,
		breaks: true
	})

	const setActive = (activeTab) => {
		tabs.forEach((tab) => {
			tab.classList.toggle("is-active", tab === activeTab)
		})
	}

	const renderDoc = (tab) => {
		const index = Number(tab.dataset.docIndex || 0)
		const selectedDoc = documents[index]

		setActive(tab)

		if (!selectedDoc) {
			titleNode.textContent = "Documentation"
			contentNode.innerHTML = "<p>Could not find this section.</p>"
			return
		}

		titleNode.textContent = selectedDoc.title || "Documentation"
		const rendered = marked.parse(selectedDoc.markdown || "")
		contentNode.innerHTML = DOMPurify.sanitize(rendered, { USE_PROFILES: { html: true } })
	}

	tabs.forEach((tab) => {
		tab.addEventListener("click", () => {
			renderDoc(tab)
		})
	})

	root.dataset.bound = "true"
	renderDoc(tabs[0])
}

document.addEventListener("turbo:load", setupMarquees)
document.addEventListener("turbo:load", setupDocsBrowser)
document.addEventListener("turbo:before-cache", teardownMarquees)
