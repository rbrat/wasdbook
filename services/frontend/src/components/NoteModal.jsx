import React, {useEffect, useState} from "react";
import {path} from "../helpers";
import moment from "moment";

const NoteModal = ({ active, handleModal, token, id, setErrorMessage }) => {
    const [title, setTitle] = useState("");
    const [contents, setContents] = useState("");
    const [isPublic, setIsPublic] = useState(false);
    const [created, setCreated] = useState(null);
    const [modified, setModified] = useState(null);

    useEffect(() => {
        const getNote = async () => {
            const requestOptions = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
            };
            const response = await fetch(path + `/notes/${id}`, requestOptions);
            const data = await response.json();
            if (!response.ok) {
                setErrorMessage("Could not load the note. " + data.detail);
            } else {
                setTitle(data.title);
                setContents(data.contents);
                setIsPublic(data.is_public);
                setCreated(data.created);
                setModified(data.modified);
            }
        };

        if (id) {
            getNote();
        }
    }, [id, token]);

    const cleanFormData = () => {
        setTitle("");
        setContents("");
        setIsPublic(false);
        setCreated(null);
        setModified(null);
    };

    const handleCreateNote = async(e) => {
        e.preventDefault();
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
                accept: "application/json"
            },
            body: JSON.stringify({
                title: title,
                contents: contents,
                is_public: isPublic,
            }),
        };
        const response = await fetch(path + "/notes", requestOptions);
        const data = await response.json();
        if (!response.ok) {
            setErrorMessage("Something went wrong while creating new note. " + data.detail);
        } else {
            handleClose();
        }
    };

    const handleUpdateNote = async (e) => {
        e.preventDefault(); 
        const requestOptions = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({
                title: title,
                contents: contents,
                is_public: isPublic,
            }),
        };
        const response = await fetch(path + `/notes/${id}`, requestOptions);
        const data = await response.json();
        if (!response.ok) {
            setErrorMessage("Something went wrong while updating a note. " + data.detail);
        } else {
            handleClose();
        }
    };

    const handleClose = () => {
        cleanFormData();
        handleModal();
    };

    return (
        <div className={`modal ${active && "is-active"}`}>
            <div className="modelbackground">
                <div className="model-card">
                    <header className="modal-card-head has-background-primary-light">
                        <h1 className="modal-card-title">
                            {id ? "Update note" : "Create note"}
                        </h1>
                    </header>
                    <section className="modal-card-body">
                        <form>
                            { 
                                created && (
                                <div className="field">
                                    <label className="label has-text-weight-normal">Created: {moment(created).format("DD.MM.YYYY HH:mm")}</label>
                                </div>
                                )
                            }
                            {
                                modified && modified !== created && (
                                    <div className="field">
                                        <label className="label has-text-weight-normal">Modified: {moment(modified).format("DD.MM.YYYY HH:mm")}</label>
                                    </div>
                                )
                            }
                            <div className="field">
                                <label className="label">Title</label>
                                <div className="control">
                                    <input 
                                        type="text"
                                        placeholder="Enter title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="input"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Contents</label>
                                <div className="control">
                                    <textarea 
                                        placeholder="Enter note contents"
                                        value={contents}
                                        onChange={(e) => setContents(e.target.value)}
                                        className="textarea"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Public note: </label>
                                <div className="control">
                                    <input
                                        type="checkbox"
                                        checked={isPublic}
                                        name="isPublic"
                                        onClick={() => setIsPublic(!isPublic)}
                                    />
                                </div>
                            </div>
                        </form>
                    </section>
                    <footer className="modal-card-foot has-background-primary-light">
                        {id ? (
                            <button className="button is-info" onClick={handleUpdateNote}>
                                Update
                            </button>
                        ) : (
                            <button className="button is-primary" onClick={handleCreateNote}>
                                Create
                            </button>   
                        )}
                        <button className="button" onClick={handleClose}>
                            Cancel
                        </button>
                    </footer>
                </div>
            </div>
        </div>
    )
};

export default NoteModal;