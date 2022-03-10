const char rpiPage[] =
R"=====(
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
  </head>
  <body>
    <div class="root">
      <form id="step2" action="/get" method="GET" class="step">
        <h1 class="title">
          Connexion à votre
          <span style="white-space: nowrap">Raspberry Pi :</span>
        </h1>
        <span id="error"></span>
        <div class="form-group">
          <label class="label">Adresse IP du Raspberry Pi</label>
          <input
            type="text"
            class="input"
            placeholder="IP du Raspberry Pi"
            name="ip"
            required
          />
          <label class="label">PORT du Raspberry Pi</label>
          <input
            type="text"
            class="input"
            placeholder="Port du RPI"
            name="port"
            required
          />
        </div>
        <button type="submit" class="button">Connecter</button>
      </form>
    </div>
    <script>
      let error = document.getElementById("error");
      if (true) {
        error.innerHTML =
          "Aucun raspberry n'a été touvé, veuillez vérifier l'adresse";
      }
    </script>
  </body>
</html>
)=====";
