import { useState } from "react";

const DeletePopup = ({ textToWrite, callback }) => {
  const [content, setContent] = useState("");

  return (
    <article className="reveal">
      <h2 className="title">Supprimer le compte</h2>
      <p>Cette action supprimera votre compte de manière définitive.</p>

      <div className="form-group full-width">
        <label className="label">Recopiez le texte ci-dessous</label>
        <input
          onChange={(e) => setContent(e.target.value)}
          placeholder={textToWrite && textToWrite}
          className="secondary-input "
        />
      </div>
      <button
        className={`button ${
          content === textToWrite ? "outlined-error" : "disabled"
        }`}
        onClick={() => {
          content === textToWrite && callback();
        }}
      >
        Supprimer
      </button>
    </article>
  );
};

export default DeletePopup;
