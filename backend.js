const ui = {
  textInput: document.getElementById("textInput"),
  translationInput: document.getElementById("translationInput"),
  translateBtn: document.getElementById("translateBtn"),
  targetLanguageSelect: document.getElementById("targetLanguageSelect"),
  statusText: document.getElementById("statusText")
};

const api = {
  baseUrl: "https://api-free.deepl.com/v2",
  authKey: "0b7f2edf-519b-4fc1-b0ea-1d694c61180a:fx"
};

const fallbackLanguages = [
  { language: "EN", name: "English" },
  { language: "ES", name: "Spanish" },
  { language: "FR", name: "French" },
  { language: "DE", name: "German" },
  { language: "IT", name: "Italian" },
  { language: "PT-PT", name: "Portuguese (Portugal)" },
  { language: "PT-BR", name: "Portuguese (Brazil)" }
];

startApp();

async function startApp() {
  ui.translateBtn.addEventListener("click", handleTranslateClick);
  await loadLanguages();
}

function setStatus(text) {
  ui.statusText.textContent = text;
}

async function loadLanguages() {
  setStatus("Loading languages...");

  try {
    const response = await fetch(`${api.baseUrl}/languages?type=target`, {
      headers: { Authorization: `DeepL-Auth-Key ${api.authKey}` }
    });

    if (!response.ok) {
      throw new Error("Could not load languages");
    }

    const languages = await response.json();
    fillLanguageDropdown(languages);
    setStatus(`${languages.length} languages available`);
  } catch (error) {
    fillLanguageDropdown(fallbackLanguages);
    setStatus("Using fallback language list");
    console.error(error);
  }
}

function fillLanguageDropdown(languages) {
  ui.targetLanguageSelect.innerHTML = "";

  const sorted = [...languages].sort((a, b) => a.name.localeCompare(b.name));

  for (const lang of sorted) {
    const option = document.createElement("option");
    option.value = lang.language;
    option.textContent = `${lang.name} (${lang.language})`;
    ui.targetLanguageSelect.appendChild(option);
  }

  ui.targetLanguageSelect.value = "FR";
}

async function handleTranslateClick() {
  const inputText = ui.textInput.value.trim();

  if (!inputText) {
    ui.translationInput.value = "";
    setStatus("Enter text to translate");
    return;
  }

  ui.translateBtn.disabled = true;
  setStatus("Translating...");

  try {
    const response = await fetch(`${api.baseUrl}/translate`, {
      method: "POST",
      headers: {
        Authorization: `DeepL-Auth-Key ${api.authKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: [inputText],
        target_lang: ui.targetLanguageSelect.value
      })
    });

    if (!response.ok) {
      throw new Error("Translation request failed");
    }

    const data = await response.json();
    ui.translationInput.value = data.translations[0].text;
    setStatus("Done");
  } catch (error) {
    ui.translationInput.value = "";
    setStatus("Translation failed");
    console.error(error);
  } finally {
    ui.translateBtn.disabled = false;
  }
}
