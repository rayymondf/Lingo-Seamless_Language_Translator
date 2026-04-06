const textInput = document.getElementById("text");
const translationInput = document.getElementById("translation");
const translateBtn = document.getElementById("translateBtn");

translateBtn.addEventListener("click", async function () {
    const text = textInput.value.trim();

    if (text === "") {
        translationInput.value = "Please enter text";
        return;
    }

    translationInput.value = "Translating...";

    try {
        const response = await fetch("http://localhost:5000/translate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                q: text,
                source: "en",      // language the user types in
                target: "es",      // language you want to translate to
                format: "text"
            })
        });

        if (!response.ok) {
            throw new Error("Translation request failed");
        }

        const data = await response.json();
        translationInput.value = data.translatedText;
    } catch (error) {
        translationInput.value = "Error translating text";
        console.error(error);
    }
});