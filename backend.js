// const textInput = document.getElementById("textInput")
// const translationInput = document.getElementById("translationInput")
// const translateBtn = document.getElementById("translateBtn")
// let counter = 0
// let inputHistory = []
// let translateHistory = []


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



// async function testDeepL() {
//     const response = await fetch("https://api-free.deepl.com/v2/translate", {
//         method: "POST",
//         headers: {
//             "Authorization": "DeepL-Auth-Key 0b7f2edf-519b-4fc1-b0ea-1d694c61180a:fx",
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//             text: [textInput.value],
//             target_lang: "HR"
//         })
//     });

//     const data = await response.json();
//     console.log(data.translations[0].text)
//     return data.translations[0].text
// }

// translateBtn.addEventListener("click", async function(){
//     translationInput.value = await testDeepL()
// })

const textInput = document.getElementById("textInput");
const translationInput = document.getElementById("translationInput");
const translateBtn = document.getElementById("translateBtn");
const targetLanguageSelect = document.getElementById("targetLanguageSelect");
const statusText = document.getElementById("statusText");

const DEEPL_BASE_URL = "https://api-free.deepl.com/v2";
const DEEPL_AUTH_KEY = "0b7f2edf-519b-4fc1-b0ea-1d694c61180a:fx";

// Minimal fallback list in case /languages request fails.
const fallbackTargetLanguages = [
  { language: "EN", name: "English" },
  { language: "ES", name: "Spanish" },
  { language: "FR", name: "French" },
  { language: "DE", name: "German" },
  { language: "IT", name: "Italian" },
  { language: "PT-PT", name: "Portuguese (Portugal)" },
  { language: "PT-BR", name: "Portuguese (Brazil)" }
];

function setStatus(message) {
  statusText.textContent = message;
}

function populateLanguageOptions(languages) {
  targetLanguageSelect.innerHTML = "";

  languages
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach((lang) => {
      const option = document.createElement("option");
      option.value = lang.language;
      option.textContent = `${lang.name} (${lang.language})`;
      targetLanguageSelect.appendChild(option);
    });

  // Reasonable default for first use.
  targetLanguageSelect.value = "FR";
}

// Loads translation target languages directly from DeepL so the selector stays up-to-date.
async function loadTargetLanguages() {
  try {
    setStatus("Loading languages...");
    const response = await fetch(`${DEEPL_BASE_URL}/languages?type=target`, {
      method: "GET",
      headers: {
        Authorization: `DeepL-Auth-Key ${DEEPL_AUTH_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`Unable to fetch languages (${response.status})`);
    }

    const languages = await response.json();

    if (!Array.isArray(languages) || languages.length === 0) {
      throw new Error("No languages returned by DeepL");
    }

    populateLanguageOptions(languages);
    setStatus(`${languages.length} languages available`);
  } catch (error) {
    populateLanguageOptions(fallbackTargetLanguages);
    setStatus("Using fallback language list");
    console.error(error);
  }
}

async function translateText() {
  const inputText = textInput.value.trim();
  if (!inputText) {
    setStatus("Enter text to translate");
    translationInput.value = "";
    return;
  }

  translateBtn.disabled = true;
  setStatus("Translating...");

  try {
    const response = await fetch(`${DEEPL_BASE_URL}/translate`, {
      method: "POST",
      headers: {
        Authorization: `DeepL-Auth-Key ${DEEPL_AUTH_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: [inputText],
        // Source language is omitted intentionally so DeepL auto-detects it.
        target_lang: targetLanguageSelect.value
      })
    });

    if (!response.ok) {
      throw new Error(`Translation failed (${response.status})`);
    }

    const data = await response.json();

    translationInput.value = data?.translations?.[0]?.text ?? "";
    setStatus("Done");
  } catch (error) {
    translationInput.value = "";
    setStatus("Translation failed");
    console.error(error);
  } finally {
    translateBtn.disabled = false;
  }
}


loadTargetLanguages();
translateBtn.addEventListener("click", translateText);