# Pin npm packages by running ./bin/importmap

pin "application"
pin "@hotwired/turbo-rails", to: "turbo.min.js"
pin "@hotwired/stimulus", to: "stimulus.min.js"
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js"
pin "marked", to: "https://ga.jspm.io/npm:marked@16.4.1/lib/marked.esm.js"
pin "dompurify", to: "https://ga.jspm.io/npm:dompurify@3.3.0/dist/purify.es.mjs"
pin_all_from "app/javascript/controllers", under: "controllers"
