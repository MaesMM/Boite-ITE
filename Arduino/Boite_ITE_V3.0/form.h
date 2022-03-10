//=========================================
//HTML + CSS + JavaScript codes for webpage
//=========================================

const char formPage[] = R"=====(
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap"
      rel="stylesheet"
    />
    <title>Configuration</title>

    <style>
      :root {
        --text-400: #151b31;
        --text-600: #383b53;
        --accent-400: #00bfb3;
        --accent-300: #03b5aa;
      }

      body {
        margin: 0;
      }

      body * {
        font-family: "Be Vietnam Pro", sans-serif;
        color: var(--text-400);
      }

      .root {
        width: 100%;
        box-sizing: border-box;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
        padding: 16px;
        animation: fadeIn 2s ease forwards;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      .button {
        display: block;
        margin-top: 40px;
        text-decoration: none;
        width: fit-content;
        padding: 16px 32px;
        font-weight: 700;
        font-size: 1.1rem;
        color: #fff;
        border: 0;
        background-color: var(--accent-400);
        cursor: pointer;
        border-radius: 16px;
        transition: all 0.2s ease;
      }

      .button:hover {
        background-color: var(--accent-300);
        transition: all 0.2s ease;
      }

      .title {
        margin: 0 0 64px 0;
      }

      .step {
        max-width: 480px;
        height: fit-content;
        display: flex;
        flex-direction: column;
        justify-content: center;
        transition: all 0.5s ease;
      }

      .form-group {
        display: flex;
        flex-direction: column;
        row-gap: 16px;
        margin-bottom: 32px;
      }

      .label {
        font-weight: 700;
      }

      .input {
        border: 0;
        height: 48px;
        padding: 0 16px;
        font-size: 1.05rem;
        border-radius: 16px;
        background-color: #ececec;
        outline: none;
      }

      .spinner {
        align-self: center;
        width: 25%;
        height: auto;
        fill: var(--accent-400);
        animation: spin 1s linear forwards infinite;
      }

      .text {
        max-width: 360px;
        margin-bottom: 64px;
      }

      .icon {
        width: 35%;
        height: auto;
        align-self: center;
        fill: var(--accent-400);
      }

      #step4 .title {
        margin-bottom: 24px;
      }

      @keyframes spin {
        0% {
          transform: rotate(0);
        }

        20% {
          transform: rotate(40deg);
        }
        40% {
          transform: rotate(100deg);
        }

        70% {
          transform: rotate(280deg);
        }
        80% {
          transform: rotate(320deg);
        }

        100% {
          transform: rotate(360deg);
        }
      }

      .hidden {
        position: absolute;
        visibility: hidden;
        opacity: 0;
        transition: all 0.5s ease;
        animation: vanish 0.5s 0.1s forwards;
      }

      #error {
        margin-bottom: 32px;
        color: #e74040;
        font-weight: 600;
      }
    </style>
    <style>
      :root {
        --text-400: #151b31;
        --text-600: #383b53;
        --text-700: rgb(103, 109, 152);
        --grey-400: #ececec;
        --accent-400: #00bfb3;
        --accent-300: #03b5aa;
      }

      .title {
        margin-bottom: 16px;
      }
      .network-box {
        width: 100%;
        height: 100%;
        background-color: var(--grey-400);
        border-radius: 24px;
        box-sizing: border-box;
        overflow: hidden;
        transition: all 0.2s ease;
      }

      .network-list {
        display: flex;
        flex-direction: column;
        row-gap: 16px;
        width: 100%;
        height: 30vh;
        min-height: 304px;
        padding: 0 16px 0 16px;
        border-radius: 16px;
        scrollbar-width: thin;
        box-sizing: border-box;
        overflow-y: scroll;
        transition: all 0.5s ease;
      }

      .network-box.closed {
        min-height: 0 !important;
        height: fit-content !important;
        transition: all 0.2s ease;
      }

      @keyframes close {
        from {
          min-height: 500px;
          height: 50vh;
        }

        to {
        }
      }

      .network-list.closed {
        min-height: 0;
        height: 88px;
        overflow-y: hidden;
        padding: 0 16px 0 16px;
        transition: all 0.5s ease;
      }

      .network-list.closed > .network-input:checked + .network {
        box-shadow: 0;
        transition: all 0.2s ease;
      }

      .network-list::-webkit-scrollbar {
        width: 6px;
      }
      .network-list::-webkit-scrollbar-track {
        transform: translateX(-4px);
        width: 6px;
      }
      .network-list::-webkit-scrollbar-thumb {
        background-color: #ccc;
        border-radius: 100px;
      }

      .network-input {
        display: none;
      }

      .network {
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        padding: 0 16px;
        width: 100%;
        font-weight: 500;
        height: 56px;
        border-radius: 16px;
        background-color: #fff;
        cursor: pointer;
        filter: drop-shadow(0 4px 16px rgba(0, 0, 0, 0.05));
        transition: all 0.2s ease;
      }

      .network-container:first-child {
        margin-top: 16px;
      }
      .network-container:last-child {
        margin-bottom: 16px;
      }
      .network-list.closed .network-container {
        margin: 0;
      }
      .order {
        margin: 16px 0 !important;
        order: -1;
      }

      .network:hover {
        box-shadow: inset 0 0 0 3px rgba(0, 191, 179, 0.5);
        transition: all 0.2s ease;
      }

      .network-power {
        display: flex;
        align-items: flex-end;
        column-gap: 4px;
        width: 24px;
        height: 24px;
      }

      .network-power div {
        width: 4px;
        border-radius: 100px;
        background-color: #ececec;
      }

      .firstBar {
        height: calc(100% / 3);
      }
      .secondBar {
        height: calc(calc(100% / 3) * 2);
      }
      .thirdBar {
        height: 100%;
      }

      .on {
        background-color: var(--text-700) !important;
      }
    </style>
  </head>
  <body>
    <div class="root">
      <form id="step2" action="/get" method="GET" class="step">
        <h1 class="title">
          Connexion à votre réseau
          <span style="white-space: nowrap">WiFi :</span>
        </h1>
        <!--<span id="error"></span>-->

        <div class="form-group">
          <label class="label">Réseau WiFi :</label>
          <div class="network-box" id="networkBox">
            <div class="network-list" id="networkList">
)=====";

const char formPage2[] = R"=====(
</div>
          </div>
        </div>

        <div class="form-group">
          <label class="label">Mot de passe réseau</label>
          <input
            type="password"
            class="input"
            placeholder="Mot de passe réseau"
            name="password"
            required
          />
        </div>

        <button type="submit" class="button">Connecter</button>
      </form>
    </div>
    <script>
      let error = document.getElementById("error");

      let networks = document.querySelectorAll(".network-container");
      let networkList = document.getElementById("networkList");
      let networkBox = document.getElementById("networkBox");

      networkBox.addEventListener("click", () => {
        networks.forEach((network) => {
          network.addEventListener("click", () => {
            networkList.scrollTop = 0;
            networkBox.classList.toggle("closed");
            networkList.classList.toggle("closed");
          });

          if (network.children[0].checked) {
            network.classList.add("order");
          } else {
            network.classList.remove("order");
          }
        });
      });

      if (true) {
        error.innerHTML =
          "Erreur de connexion, réseau indisponible ou mot de passe incorrect";
      }
    </script>
  </body>
</html>
)=====";
