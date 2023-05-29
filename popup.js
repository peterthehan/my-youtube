document.addEventListener("DOMContentLoaded", function () {
  const actionMenuCheckbox = document.getElementById("actionMenuToggle");
  const shortsCheckbox = document.getElementById("shortsToggle");
  const blacklistTextarea = document.getElementById("blacklist");
  const saveButton = document.getElementById("saveButton");

  chrome.storage.sync.get("options", function ({ options }) {
    const actionMenuToggle = options?.actionMenuToggle ?? false;
    const shortsToggle = options?.shortsToggle ?? false;
    const blacklist = options?.blacklist ?? [];

    actionMenuCheckbox.checked = actionMenuToggle;
    shortsCheckbox.checked = shortsToggle;
    blacklistTextarea.value = blacklist.join("\n");
  });

  saveButton.addEventListener("click", function () {
    const options = {
      actionMenuToggle: actionMenuCheckbox.checked,
      shortsToggle: shortsCheckbox.checked,
      blacklist: blacklistTextarea.value.split("\n"),
    };
    chrome.storage.sync.set({ options }, function () {
      alert("Saved!");
    });
  });
});
