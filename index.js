import PVObject from 'PersistentData';
import request from 'request/index';
import Promise from 'Promise/index';

const DATA = new PVObject('cygsweightmod', {
	apiKey: 'Not set',
	username: 'Not set',
})

function getKey(){
	return DATA.apiKey;
}
function setName(name){
	DATA.username = name;
}

function sendRequest(url) {
	const returnedPromise = request({
		url: url,
		headers: {
			['User-Agent']: 'Mozilla/5.0 (ChatTriggers)',
		},
	});
	return new Promise((resolve, reject) => {
		returnedPromise
			.then((value) => resolve(JSON.parse(value)))
			.catch((err) => reject(err));
	});
}

// var gui = new Gui();

// function render(){
// 	Renderer.drawRect(Renderer.GRAY, 50, 50, 535, 250);
// 	Renderer.drawRect(Renderer.BLACK, 60, 60, 515, 230);
// }

//reminder
TriggerRegister.registerWorldLoad(function(){
	if (DATA.apiKey === undefined || DATA.apiKey === 'Not set'){
		ChatLib.chat('§3=======================================================');
		ChatLib.chat(ChatLib.getCenteredText('§e§lRemember to set your hypixel API key with /setkey [key]'));
		ChatLib.chat('§3=======================================================');
	}
})

//weight
TriggerRegister.registerCommand(function(name){
	if (name === undefined){
		if (DATA.username === undefined || DATA.username === 'Not set'){
			ChatLib.chat('Specify a name with /weight {name}')
			return;
		}
		else{
			name = DATA.username;
		}
	}
	new Message("§b§oLoading...").setChatLineId(5050).chat();
	sendRequest(
		'https://api.mojang.com/users/profiles/minecraft/' + name)
		.then(player => {
			let uuid = player.id
			sendRequest(
				'https://hypixel-skyblock-facade.cygnusx.repl.co/v1/profiles/' + uuid + '/weight?key=' + getKey(),
			)
			.then(response => {
				ChatLib.clearChat(5050);
				ChatLib.chat(ChatLib.getCenteredText('§6<§e§lWeight for ' + name + '§6>'))
				ChatLib.chat('§6Total Weight: §f' + Math.round(+response['data']['weight'] + +response['data']['weight_overflow']))
				ChatLib.chat('§6Weight: §f' + Math.round(+response['data']['weight']) + ' (+' + Math.round(response['data']['weight_overflow']) + '§e Overflow§f)')
				ChatLib.chat('§6Skills: §f' + Math.round(+response['data']['skills']['weight']) + ' (+' + Math.round(response['data']['skills']['weight_overflow']) + '§e Overflow§f)')
				ChatLib.chat('§6Slayers: §f' + Math.round(+response['data']['slayers']['weight']) + ' (+' + Math.round(response['data']['slayers']['weight_overflow']) + '§e Overflow§f)')
				ChatLib.chat('§6Dungeons: §f' + Math.round(+response['data']['dungeons']['weight']) + ' (+' + Math.round(response['data']['dungeons']['weight_overflow']) + '§e Overflow§f)')
			})
			.catch(err => {
				ChatLib.chat(err);
			});
		})
		.catch(err  => {
			ChatLib.chat('You need to provide a valid username!');
		});
		
	
}).setName("weight")

//Keys
TriggerRegister.registerCommand(function(key){
	if (key === undefined){
		ChatLib.chat('error, no key provided');
	}
	else{
		DATA.apiKey = key;
		ChatLib.chat('Success!')
	}
}).setName("setkey")

TriggerRegister.registerCommand(function(){
	// gui.registerDraw(render);
	// gui.open();
	ChatLib.chat(DATA.apiKey);
}).setName("getkey")

TriggerRegister.registerCommand(function(){
	ChatLib.chat('Key removed');
	DATA.apiKey = 'Not set'
}).setName("delkey")

//names
TriggerRegister.registerCommand(function(){
	ChatLib.chat(DATA.username);
}).setName("getname")

TriggerRegister.registerCommand(function(name){
	setName(name);
	ChatLib.chat('Set your username to ' + name);
}).setName("setname")

TriggerRegister.registerCommand(function(){
	DATA.username = 'Not set'
	ChatLib.chat('Name removed!');
}).setName("delname")

