(async function () {
  const resp = await API.profile();
  const user = resp.data;
  if (!user) {
    alert("未登录或登录已过期");
    location.href = "./login.html";
    return;
  }

  //

  const doms = {
    aside: {
      nickname: $("#nickname"),
      loginId: $("#loginId"),
    },
    close: $(".close"),
    chatContainer: $(".chat-container"),
    txtMsg: $("#txtMsg"),
    msgContainer: $(".msg-container"),
  };
  doms.close.onclick = function () {
    API.loginOut();
    location.href = "./login.html";
  }; //注销事件

  function setUserInfo() {
    doms.aside.nickname.innerText = user.nickname;
    doms.aside.loginId.innerText = user.loginId;
  } //显示用户信息
  setUserInfo();

  //   API.getHistory()
  function addChat(chatInfo) {
    const div = $$$("div");
    div.classList.add("chat-item");
    if (chatInfo.from) {
      div.classList.add("me");
    }
    const img = $$$("img");
    img.classList.add("chat-avatar");
    img.src = chatInfo ? "./asset/avatar.png" : "./asset/robot-avatar.jpg";

    const content = $$$("div");
    content.classList.add("chat-content");
    content.innerText = chatInfo.content;

    const date = $$$("div");
    date.classList.add("chat-date");
    date.innerText = formatDate(chatInfo.createdAt);
    div.appendChild(img);
    div.appendChild(content);
    div.appendChild(date);
    doms.chatContainer.appendChild(div);
  }
  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");
    const second = date.getSeconds().toString().padStart(2, "0");
    return `${year}-${month}-${day}:${hour}:${minute}:${second}`;
  }
  async function loadHistory() {
    const resp = await API.getHistory();
    await resp.data.forEach((resp) => {
      addChat(resp);
    });
    scrollBottom();
  } //加载历史记录
  loadHistory();

  function scrollBottom() {
    doms.chatContainer.scrollTop = doms.chatContainer.scrollHeight;
  } //滚动条轮动到最后

  async function sendChat() {
    const content = doms.txtMsg.value.trim();
    if (!content) {
      return;
    }
    addChat({ from: user.loginId, to: null, createdAt: Date.now(), content });
    scrollBottom();
    doms.txtMsg.value = "";
    const resp = await API.sendChat(content);
    addChat({
      from: null,
      to: user.loginId,
      ...resp.data,
    });
    scrollBottom();
  } //发送消息
  doms.msgContainer.onsubmit = function (e) {
    e.preventDefault();
    sendChat();
  };
})();
