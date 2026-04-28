const lastTexts = new Map();
function createLogContainer() {
	const uiLayer = document.getElementById('game-container');
	if (!uiLayer) return;

	if (document.getElementById('chat-log-container')) return;

	const logContainer = document.createElement('div');
	logContainer.id = 'chat-log-container';
	logContainer.style.cssText = `
		position: fixed;
		top: 275px;
		left: 180px;
		transform: translate(-50%, -50%);
		background: white;
		border: 1px solid #ccc;
		padding: 10px;
		height: 400px; /* Фиксированная высота контейнера */
		z-index: 9999;
		font-family: Arial, sans-serif;
		font-size: 12px;
		width: 300px;
		border-radius: 8px;
		display: flex;
		flex-direction: column;
		transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		background: rgba(255, 255, 255, 0.8);
		backdrop-filter: blur(5px);
		border: 2px solid rgba(255, 255, 255, 0.5);
		border-radius: 25px;
		box-shadow: 0 4px 15px rgba(0,0,0,0.1);
		`;
	
	
	const titleContainer = document.createElement('div');
	titleContainer.style.cssText = `
	  display: flex;
	  align-items: center; /* Выравниваем элементы по вертикали */
	`;
	
	const title = document.createElement('h3');
	title.style.cssText = `
		margin: 0;
		padding: 10px 0;
		flex: 0 0 auto;
		`;
	title.textContent = 'История чата';

	const collapseButton = document.createElement('button');
	collapseButton.textContent = 'Свернуть';
	collapseButton.style.cssText = `
		margin-left: auto;
		padding: 5px 10px;
		cursor: pointer;
		border: none;
		background-color: #f0f0f0;
		border-radius: 4px;
		transition: background-color 0.3s;
		
		transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		background: rgba(255, 255, 255, 0.8);
		backdrop-filter: blur(5px);
		border: 2px solid rgba(255, 255, 255, 0.5);
		border-radius: 25px;
		box-shadow: 0 4px 15px rgba(0,0,0,0.1);
		`;

	collapseButton.addEventListener('click', () => {
		const logList = document.getElementById('chat-log-list');
		if (logList.style.display === 'none') 
		{
			logList.style.display = ''; // Развернуть
			logContainer.style.height = `400px`;
			logContainer.style.top = `283px`;
			logContainer.style.left = `180px`;
			collapseButton.textContent = 'Свернуть';
		}
		else
		{
			logList.style.display = 'none'; // Свернуть
			logContainer.style.height = `35px`;
			logContainer.style.top = `100px`;
			logContainer.style.left = `180px`;
			collapseButton.textContent = 'Развернуть';
		}
		});
	//title.appendChild(collapseButton);
	const logList = document.createElement('ul');
	logList.id = 'chat-log-list';
	logList.style.cssText = `
		margin: 0;
		padding: 0;
		list-style: none;
		flex: 1; /* Занимает всё оставшееся пространство */
		overflow-y: auto; /* Вертикальная прокрутка */
		`;

	titleContainer.appendChild(title);
	titleContainer.appendChild(collapseButton);
	
	logContainer.appendChild(titleContainer);
	logContainer.appendChild(logList);
	uiLayer.appendChild(logContainer);
}

function	extractChatData()	
{
	createLogContainer();
	const logList = document.getElementById('chat-log-list');
	if (!logList) return;

	const players = document.querySelectorAll('div.player, div.player.visible');

	players.forEach(player => 
	{
		const playerNameElement = player.querySelector('.player-name');
		const playerName = playerNameElement ? playerNameElement.textContent.trim() : 'Unknown';

		const chatBubble = player.querySelector('div.chat-bubble');

		if (chatBubble) {
			const currentText = chatBubble.textContent.trim();
			const lastText = lastTexts.get(chatBubble);

			if (currentText && currentText !== lastText) {
				const now = new Date();
				const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

				const listItem = document.createElement('li');
				listItem.style.cssText = 'padding: 5px 0; border-bottom: 1px solid #eee;';
				listItem.innerHTML = `<strong>[${timeString}] ${playerName}:</strong> ${currentText}`;

				logList.appendChild(listItem);
				lastTexts.set(chatBubble, currentText);

				if (logList.style.display !== 'none') {
					logList.scrollTop = logList.scrollHeight;
				}
			}
		}
	});
}

function setupObserver() {
	const observer = new MutationObserver((mutations) => {
	mutations.forEach((mutation) =>
		{
			if (mutation.target.matches &&
				(mutation.target.matches('.player') || mutation.target.matches('.player.visible'))) 
				{
					setTimeout(extractChatData, 100); // Задержка для стабилизации
				}

		mutation.addedNodes.forEach(node => 
			{
				if (node.nodeType === 1) 
				{
					if (node.matches && (node.matches('.player') || node.matches('.player.visible'))) 
						{
							setTimeout(extractChatData, 100);
						}
				}
			});
		});
	});

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true
  });
}


function init() {
	createLogContainer();
	setupObserver();
	setInterval(extractChatData, 2000); // Периодическая проверка
	extractChatData(); // Первоначальная проверка
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', init);
} else {
	init();
}
