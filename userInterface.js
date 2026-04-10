const targetLanguage = document.getElementById("targetLanguage")

async function loadLanguages() {
    try {
        const response = await fetch("https://api-free.deepl.com/v2/languages?type=target", {
            method: "GET",
            headers: {
                "Authorization": "DeepL-Auth-Key 306a351c-5e97-4478-aea9-ee268364fcda:fx"
            }
        })

        if (!response.ok) {
            throw new Error("Could not load languages")
        }

        const languages = await response.json()

        for (let i = 0; i < languages.length; i++) {
            let option = document.createElement("option")
            option.value = languages[i].language
            option.textContent = languages[i].name

            if (languages[i].language === "ZH") {
                option.textContent = "Chinese (generic)"
            }

            targetLanguage.append(option)
        }
    } catch (error) {
        console.log(error)
    }
}
// console.log(targetLanguage.value)
loadLanguages()
