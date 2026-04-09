
const targetLanguage = document.getElementById("targetLanguage")
async function loadLanguages() {
    const response = await fetch("https://api-free.deepl.com/v2/languages?type=target", {
        method: "GET",
        headers: {
            "Authorization": "DeepL-Auth-Key "
        }
    })

    const languages = await response.json()

    //console.log(languages)

    for(let i = 0; i < languages.length; i++){
        //console.log(languages[i].name + " " + languages[i].language)
        let option = document.createElement("option")
        option.value = languages[i].language 
        option.textContent = languages[i].name

        if (languages[i].language == "ZH"){
            option.textContent = "Chinese (generic)"

        }
        targetLanguage.append(option)

    }
}
loadLanguages()
