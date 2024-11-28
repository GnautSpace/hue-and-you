
document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".opt");
    

    cards.forEach(card => {
        card.addEventListener("click", () => {

            cards.forEach(c => c.classList.remove("selected"));


            card.classList.add("selected");


            const selectedMode = card.querySelector("h2").textContent;
            console.log(`Selected mode: ${selectedMode}`);


            localStorage.setItem("cvdMode", selectedMode);
        });
    });
});

const selectedTheme={bg: null,text: null};

const choicePalette = {
    deuteranopia: {
        bgColors: [
            { hex: "#ffffff", name: "White" },
            { hex: "#000000", name: "Black" },
            { hex: "#fea321", name: "A1" },
            { hex: "#fea231", name: "A2" },
        ],
        textColors: [
            { hex: "#ffffff", name: "White" },
            { hex: "#000000", name: "Black" },
            { hex: "#fea321", name: "A1" },
            { hex: "#fea231", name: "A2" },
        ],
    },
    protanopia: {
        bgColors: [
            { hex: "#ffffff", name: "White" },
            { hex: "#f0f0f0", name: "Light Gray" },
        ],
        textColors: [
            { hex: "#101010", name: "Very Dark Gray" },
            { hex: "#222222", name: "Charcoal" },
        ],
    },
    tritanopia: {
        bgColors: [
            { hex: "#ffffff", name: "White" },
            { hex: "#b0c4de", name: "Light Steel Blue" },
        ],
        textColors: [
            { hex: "#00008b", name: "Dark Blue" },
            { hex: "#5f9ea0", name: "Cadet Blue" },
        ],
    },
    achromatopsia: {
        bgColors: [
            { hex: "#dcdcdc", name: "Gainsboro" },
            { hex: "#f5f5f5", name: "White Smoke" },
        ],
        textColors: [
            { hex: "#696969", name: "Dim Gray" },
            { hex: "#808080", name: "Gray" },
        ],
    },
};

function populateDropdowns(selectEle, options, valueKey, textKey) {
    options.forEach(optData => {
        const option = document.createElement("option");
        option.value = optData[valueKey];
        option.textContent = optData[textKey];
        selectEle.appendChild(option);
    });
}



Object.keys(choicePalette).forEach((key)=>{
    const card=document.querySelector(`.opt.${key}`);
    if(card){
        const bgSelect=card.querySelector('.bg-select');
        const textSelect=card.querySelector('.text-select');

        const {bgColors,textColors}=choicePalette[key];
        populateDropdowns(bgSelect,bgColors,"hex","name");
        populateDropdowns(textSelect,textColors,"hex","name");

        bgSelect.addEventListener("change",(e)=>{
            selectedTheme.bg=e.target.value;
            console.log(`Selected background theme: ${selectedTheme.bg}`);
        });
        textSelect.addEventListener("change",(e)=>{
            selectedTheme.text=e.target.value;
            console.log(`SElected text theme: ${selectedTheme.text}`);
        });

    }
});


document.querySelector("#apply").addEventListener("click", () => {
    console.log("Apply button clicked.");
    
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs.length) {
            console.error("No active tab found.");
            return;
        }
        console.log("Active tab found:", tabs[0]);

        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: (theme) => {
                document.body.style.backgroundColor = theme.bg;
                document.body.style.color = theme.text;

                document.querySelectorAll("*").forEach(ele=>{
                    ele.style.backgroundColor=theme.bg;
                    ele.style.color=theme.text;
                })
                console.log("Theme applied in page script.");
            },
            args: [selectedTheme]
        }, () => {
            if (chrome.runtime.lastError) {
                console.error("Error applying theme:", chrome.runtime.lastError.message);
            } else {
                console.log("Theme applied successfully.");
            }
        });
    });
});


document.querySelector("#save").addEventListener("click", () => {

    if (selectedTheme.bg == selectedTheme.text) {
        alert("cannot apply theme select different bg and text colors.");
        return;

    }
    chrome.storage.sync.set({ selectedTheme }, () => {
        alert("Selections saved successfully!");
    }

    );
    //alert("selections saved succesfully");
    //console.log(selectedTheme);



});

document.querySelector("#reset").addEventListener("click", () => {
    console.log("Reset button clicked.");
    
    chrome.storage.sync.remove("selectedTheme", () => {
        if (chrome.runtime.lastError) {
            console.error("Error resetting theme:", chrome.runtime.lastError.message);
        } else {
            console.log("Theme reset in storage.");
            selectedTheme.bg = null;
            selectedTheme.text = null;
            alert("Theme reset successfully!");
        }
    });
    
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs.length) {
            console.error("No active tab found.");
            return;
        }
        
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: () => {
                document.body.style.removeProperty("background-color");
                document.body.style.removeProperty("color");
                console.log("Theme reset in page.");
                document.querySelectorAll("*").forEach(ele=>{
                    ele.style.removeProperty("background-color");
                    ele.style.removeProperty("color");
                })
            }
        }, () => {
            if (chrome.runtime.lastError) {
                console.error("Error resetting theme:", chrome.runtime.lastError.message);
            } else {
                console.log("Theme reset successfully.");
            }
        });
    });
});
