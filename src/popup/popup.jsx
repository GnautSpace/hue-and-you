import { useState } from "react";
import choicePalette from "./choicePalette";

import { geminiBionic, geminiSummarize } from "../Gemini.js";
import "./popup.css";
import PopupData from "./popupData";

import ReactMarkdown from "react-markdown";

const Popup = () => {
  const [selectedMode, setSelectedMode] = useState("");
  const [selectedTheme, setSelectedTheme] = useState({ bg: null, text: null });
  const [popupData, setPopupData] = useState(null);
  const [isProcessingBionic, setIsProcessingBionic] = useState(false);
  const [isProcessingSummarize, setIsProcessingSummarize] = useState(false);

  const handleCardClick = (mode) => {
    setSelectedMode(mode);
    localStorage.setItem("cvdMode", mode);
  };

  const handleApplyTheme = () => {
    console.log("Applying theme:", selectedTheme);
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

          document.querySelectorAll("*").forEach(ele => {
            ele.style.backgroundColor = theme.bg;
            ele.style.color = theme.text;
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
  };

  const handleSaveTheme = () => {
    if (selectedTheme.bg === selectedTheme.text) {
      alert("Cannot apply theme. Select different background and text colors.");
    } else {
      chrome.storage.sync.set({ selectedTheme }, () =>
        alert("Selections saved successfully!")
      );
    }
  };

  const handleResetTheme = () => {
    console.log("Theme reset clicked");

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
          document.querySelectorAll("*").forEach(ele => {
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
  };


  const handleConvertToBionic = async () => {
    setIsProcessingBionic(true);
    try {
      const extractedContent = await extractContentFromPage();
      const bionicText = await geminiBionic(extractedContent);
      setPopupData({ title: "Bionic Mode Output", content: <ReactMarkdown>{bionicText}</ReactMarkdown>});
    } catch (error) {
      console.error("Failed to convert to Bionic Mode:", error);
      alert("Failed to convert to Bionic Mode. Please try again!");
    } finally {
      setIsProcessingBionic(false);

    };
  }

  const extractContentFromPage = () => {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs.length) {
          reject("No active tab found.");
          return;
        }

        chrome.scripting.executeScript(
          {
            target: { tabId: tabs[0].id },
            func: () => document.body.innerText,
          },
          (results) => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError.message);
            } else {
              resolve(results[0]?.result || "");
            }
          }
        );
      });
    });
  };


  const handleSummarizeContent = async () => {
    setIsProcessingSummarize(true);
    try {
      const extractedContent = await extractContentFromPage();
      const summary = await geminiSummarize(extractedContent);
      setPopupData({ title: "Summarized Content", content: summary });
    } catch (error) {
      console.error("Failed to summarize content:", error);
      alert("Failed to summarize content. Please try again!");
    } finally {
      setIsProcessingSummarize(false);
    }
  };

  return (
    <div>
      <h1>HUE & YOU</h1>
      <div className="options">
        {Object.entries(choicePalette).map(([mode, { bgColors, textColors }]) => (
          <div
            key={mode}
            className={`opt ${mode} ${selectedMode === mode ? "selected" : ""}`}
            onClick={() => handleCardClick(mode)}
          >
            <h2>{mode.charAt(0).toUpperCase() + mode.slice(1)}</h2>
            <div className="card-opt">
              <div className="bg-opt">
                <label>Background: </label>
                <select
                  onChange={(e) =>
                    setSelectedTheme((prev) => ({ ...prev, bg: e.target.value }))
                  }
                  className="bg-select"
                >
                  {bgColors.map(({ hex, name }) => (
                    <option key={hex} value={hex}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="text-opt">
                <label>Text: </label>
                <select
                  onChange={(e) =>
                    setSelectedTheme((prev) => ({ ...prev, text: e.target.value }))
                  }
                  className="text-select"
                >
                  {textColors.map(({ hex, name }) => (
                    <option key={hex} value={hex}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="buttons">
        <button onClick={handleApplyTheme} className="btn" id="apply">Apply</button>
        <button onClick={handleSaveTheme} className="btn" id="save">Save</button>
        <button onClick={handleResetTheme} className="btn" id="reset">Reset</button>
      </div>
      <div className="sub-adv-opt">
        <button onClick={handleConvertToBionic} className="btn" disabled={isProcessingBionic}>
          {isProcessingBionic ? "Converting..." : "Bionic Mode"}
        </button>
        <button onClick={handleSummarizeContent} className="btn" disabled={isProcessingSummarize}>
          {isProcessingSummarize ? "Summarizing..." : "Summarize Site"}
        </button>
      </div>
      {popupData && (
        <PopupData
          title={popupData.title}
          content={popupData.content}
          onClose={() => setPopupData(null)}
        />
      )}
    </div>
  );
};

export default Popup;