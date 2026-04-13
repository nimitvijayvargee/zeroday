class HomeController < ApplicationController
  def index
    @submit_url = "#"

    @prize_cards = [
      {
        title: "Orpheus Pico V2 (with better art!)",
        image_url: "https://cdn.hackclub.com/019d855b-3560-7eaf-9048-e1577683cc06/orpheus.png",
        image_alt: "Orpheus Pico board"
      },
      {
        title: "A1 Mini (start a printfarm!)",
        image_url: "https://cdn.hackclub.com/019d855b-1ad8-7f09-a296-358f1dbbf22d/a1m.png",
        image_alt: "Compact 3D printer"
      },
      {
        title: "Djunkelskog (cuddles included!)",
        image_url: "https://cdn.hackclub.com/019d855b-292c-75d3-b566-c2578b5ab4c7/djunkelskog.png",
        image_alt: "Brown bear plush toy"
      },
      {
        title: "Keyboard grant!",
        image_url: "https://cdn.hackclub.com/019d855b-b4b7-7aef-aa73-e5350d65215e/keychron.png",
        image_alt: "Mechanical keyboard"
      },
      {
        title: "Pi Zero 2 W (for your project!)",
        image_url: "https://cdn.hackclub.com/019d855b-bf96-7de6-81fd-46d0245c6fdf/pizero.png",
        image_alt: "Raspberry Pi Zero board"
      },
      {
        title: "Blahaj (made from recycled materials!)",
        image_url: "https://cdn.hackclub.com/019d855b-a912-7746-8d01-0335ceb907d9/blahaj.png",
        image_alt: "Blue plush shark"
      }
    ]

    @skill_cards = [
      {
        title: "CAD and 3D modelling!",
        image_url: "https://cdn.hackclub.com/019d8558-c64a-7d32-aa7a-ef33b5997bd0/cad.png",
        image_alt: "CAD model render"
      },
      {
        title: "PCB Design (beyond breadboards)",
        image_url: "https://cdn.hackclub.com/019d8558-d459-7a3d-a49b-fd441268111b/pcb.png",
        image_alt: "Printed circuit board design"
      },
      {
        title: "Coding and Scripting!",
        image_url: "https://cdn.hackclub.com/019d8559-17ac-75b6-ba86-1413c19194cb/coding.png",
        image_alt: "Code on a monitor"
      },
      {
        title: "Soldering (first aid kit not included!)",
        image_url: "https://cdn.hackclub.com/019d8559-26b0-7755-a57a-c0ab0f173bf1/soldering.png",
        image_alt: "Soldering station setup"
      }
    ]
  end
end