const textInput = document.getElementById("textInput")
const translationInput = document.getElementById("translationInput")
const translateBtn = document.getElementById("translateBtn")
const targetLanguage = document.getElementById("targetLanguage")

const deepLApiKey = "0b7f2edf-519b-4fc1-b0ea-1d694c61180a:fx"

async function loadLanguages() {
    try {
        const response = await fetch("https://api-free.deepl.com/v2/languages?type=target", {
            method: "GET",
            headers: {
                "Authorization": `DeepL-Auth-Key ${deepLApiKey}`
            }
        })

        if (!response.ok) {
            throw new Error("Could not load languages")
        }

        const languages = await response.json()

        targetLanguage.innerHTML = ""

        languages.forEach(function(language) {
            const option = document.createElement("option")
            option.value = language.language
            option.textContent = language.name

            if (language.language === "ZH") {
                option.textContent = "Chinese (generic)"
            }

            targetLanguage.append(option)
        })
    } catch (error) {
        console.log(error)
        targetLanguage.innerHTML = '<option value="">Could not load languages</option>'
    }
}

async function translateText(selectedLanguage) {
    const response = await fetch("https://api-free.deepl.com/v2/translate", {
        method: "POST",
        headers: {
            "Authorization": `DeepL-Auth-Key ${deepLApiKey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            text: [textInput.value],
            target_lang: selectedLanguage
        })
    })

    if (!response.ok) {
        throw new Error("Translation failed")
    }

    const data = await response.json()
    return data.translations[0].text
}

translateBtn.addEventListener("click", async function() {
    if (textInput.value.trim() === "") {
        translationInput.value = "Please type something first"
        return
    }

    if (targetLanguage.value === "") {
        translationInput.value = "Choose a language first"
        return
    }

    translationInput.value = "Translating..."

    try {
        translationInput.value = await translateText(targetLanguage.value)
    } catch (error) {
        translationInput.value = "Translation failed"
        console.log(error)
    }
})

loadLanguages()
