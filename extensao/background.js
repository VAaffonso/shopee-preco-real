chrome.runtime.onMessage.addListener((request) => {
  if (request.type === "NOTIFICAR") {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icon.png",
      title: request.titulo,
      message: request.mensagem,
    });
  }
});