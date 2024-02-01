document.querySelector("input").focus();

function t([time]) {
    const hours = time.match(/[0-9]+h/);
    const minutes = time.match(/[0-9]+m/);
    return (parseInt(hours) || 0) + (parseInt(minutes) || 0) / 60;
}

class CalcStack {
    constructor() {
        this.items = [];
    }

    push(item) {
        this.items.push(item);
    }

    pop() {
        if (this.items.length === 0) {
            throw new Error("stack underflow");
        }
        return this.items.pop();
    }
}

const input = document.querySelector("#console");
const consoleLog = document.querySelector("#consolelog");
const calcStack = new CalcStack(); // Create an instance of CalcStack

input.onkeydown = (event) => {
    if (event.code === "ArrowUp") {
        input.value = input.placeholder;
        return;
    }
    if (event.code !== "Enter") return;
    let expression = input.value;
    if (!expression) {
        expression = input.placeholder;
    }
    input.value = "";
    input.placeholder = expression;
    let result;
    try {
        if (expression === "c") {
            calcStack.items = [];
            consoleLog.textContent = "";
            return;
        } else if (expression === "d") {
            result = calcStack.items[calcStack.items.length - 1];
        } else if (expression === "avg") {
            const upper = calcStack.pop();
            const lower = calcStack.pop();
            result = (upper + lower) / 2;
        } else if (expression === "r") {
            const lower = calcStack.pop();
            const upper = calcStack.pop();
            calcStack.push(lower);
            result = upper;
        } else if (expression === ".") {
            calcStack.pop();
            result = calcStack.pop();
        } else if (expression === "R") {
            result = calcStack.items.shift();
        } else if (expression === "+") {
            const lower = calcStack.pop();
            const upper = calcStack.pop();
            result = upper + lower;
        } else if (expression === "-") {
            const lower = calcStack.pop();
            const upper = calcStack.pop();
            result = upper - lower;
        } else if (expression === "*") {
            const lower = calcStack.pop();
            const upper = calcStack.pop();
            result = upper * lower;
        } else if (expression === "/") {
            const lower = calcStack.pop();
            const upper = calcStack.pop();
            result = upper / lower;
        } else if (expression === "v") {
            result = Math.sqrt(calcStack.pop());
        } else {
            const func = new Function(
                ...(calcStack.items.map((x, i) => `$${i+1}`)),
                'window',
                'return ' + expression
            );
            result = func.apply(window, [...calcStack.items, {}]);
        }
    } catch (e) {
        result = e;
    }

    console.log('result:', result);

    calcStack.push(result)
    consoleLog.textContent = calcStack.items.map((x, i) => {
        let view;
        if (x instanceof Error) {
            view = x;
        } else if (x instanceof Function) {
            if (x.prototype) {
                view = `class ${x.name}(#${x.length})`
            } else {
                view = `function ${x.name}(#${x.length})`
            }
        } else if (x instanceof Object) {
            view = "(" + x.constructor.name + ") " + JSON.stringify(x);
        } else {
            view = JSON.stringify(x);
        }

        const suffix  = (i === calcStack.items.length - 1) ? " <-" : "";
        return `$${i+1}: ` + view + suffix;
    }).join('\n');

    consoleLog.scrollBy(0, consoleLog.scrollHeight)
}

const faviconOf = (url) => `${new URL(url).origin}/favicon.ico`;

const sections = [
    {
        name: null,
        items: [
            { name: "jira", url: "https://softomate.atlassian.net" },
            { name: "confluence", url: "https://softomate.atlassian.net/wiki" },
            { name: "bitbucket", url: "https://bitbucket.org" },
            { name: "appstore connect", url: "https://appstoreconnect.apple.com" },
            { name: "payoneer", url: "https://payoneer.com" },
        ],
    },
    {
        name: "Github",
        items: [
            { name: "my page", url: "https://www.github.com/tail-call" },
            { name: "gist", url: "https://gist.github.com/tail-call" },
            { name: "wiki", url: "https://github.com/tail-call/knowledge-base/wiki" },
        ],
    },
    {
        name: "Favorites",
        items: [
            { name: "porf", url: "https://porfirevich.ru" },
            { name: "plumb", url: "https://gist.github.com/tail-call/ccc87356b6d99793c3943bc2e582035e" },
            { name: "chat", url: "https://www.equestria-tcc.ru" },
            { name: "fuzz", url: "file:///Users/scales/Library/Mobile Documents/com~apple~CloudDocs/pics/fpa/fuzzy/index.html" },
            { name: "derpi", url: "https://derpibooru.org/" },
            { name: "5621", url: "https://e621.net/" },
            { name: "yt", url: "https://youtube.com/" },
            { name: "0bin", url: "https://0bin.net/" },
        ],
    },
    {
        name: "News",
        items: [
            { name: '"hacker" "news"', url: "https://news.ycombinator.com" },
            { name: "n-gate.com", url: "https://n-gate.com" },
            { name: "mel.fm", url: "https://mel.fm" },
            { name: "baneks", url: "https://vk.com/baneks" },
        ],
    },
    {
        name: "Music",
        items: [
            { name: "websid", url: "https://www.wothke.ch/websid/" },
            { name: "deepsid", url: "https://deepsid.chordian.net" },
            { name: "chiptune.app", url: "https://chiptune.app" },
        ],
    }
];

const container = document.querySelector(".leftcolumn");

function emitHeader(text) {
    const title = document.createElement("H2");
    title.textContent = text;
    container.appendChild(title);
}

for (const section of sections) {
    if (section.name !== null) {
        emitHeader(section.name)
    }

    const linksContainer = document.createElement("p");

    for (const link of section.items) {
        const anchor = document.createElement("a");
        anchor.href = link.url;
        
        const image = document.createElement("img");
        image.src = faviconOf(link.url);
        
        const text = document.createTextNode(" " + link.name);
        
        anchor.appendChild(image);
        anchor.appendChild(text);
        
        linksContainer.appendChild(anchor);
    }

    container.appendChild(linksContainer);
}
