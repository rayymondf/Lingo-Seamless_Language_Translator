const textInput = document.getElementById("textInput")
const translationInput = document.getElementById("translationInput")
const translateBtn = document.getElementById("translateBtn")


//Following commented code is for LibreTranslate

// async function translation(){
//         const res = await fetch("http://127.0.0.1:5000/translate", {
//         method: "POST",
//         body: JSON.stringify({
//             q: textInput.value,
//             source: "en",
//             target: "fr",
//             format: "text"
//         }),
//         headers: { "Content-Type": "application/json" }
//     });

//     return await res.json()
// }

// translateBtn.addEventListener("click", async function(){
//     const data = await translation()
//     translationInput.value = data.translatedText
// })



async function testDeepL(selectedLanguage) {
    const response = await fetch("https://api-free.deepl.com/v2/translate", {
        method: "POST",
        headers: {
            "Authorization": "DeepL-Auth-Key ",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            text: [textInput.value],
            target_lang: selectedLanguage
        })
    });

    const data = await response.json();
    console.log(data.translations[0].text)
    return data.translations[0].text
}


translateBtn.addEventListener("click", async function(){
    translationInput.value = "Translating..."
    try {
        translationInput.value = await testDeepL(targetLanguage.value)
    } catch (error) {
        translationInput.value = "Translation failed"
        console.log(error)
    }
})
