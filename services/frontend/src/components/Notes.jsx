import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import ErrorMessage from "./ErrorMessage";
import NoteModal from "./NoteModal";
import moment from "moment";
import {path} from "../helpers";

const Notes = ({isPrivate}) => {
    const [token, ] = useContext(UserContext);
    const [notes, setNotes] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [loaded, setLoaded] = useState(false);
    const [activeModal, setActiveModal] = useState(false);
    const [id, setId] = useState(null);

    const getNotes = async () => {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
        };
        const response = await fetch(path + (isPrivate === true ? "/notes" : "/browse"), requestOptions);
        const data = await response.json();
        if (!response.ok) {
            setErrorMessage("Could not load notes. " + data.detail);
        } else {
            setNotes(data);
            setLoaded(true);
        }
    };

    const handleUpdate = async (id) => {
      if (isPrivate) {
        setId(id);
        setActiveModal(true);
      }
    };

    const handleDelete = async (id) => {
      const requestOptions = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      };
      const response = await fetch(path + `/notes/${id}`, requestOptions);
      const data = await response.json();
      if (!response.ok) {
        setErrorMessage("Falied to delete note. " + data.detail);
      }

      getNotes();
    };

    useEffect(() => {
        getNotes();
    }, []);

    const handleModal = () => {
      setActiveModal(!activeModal);
      getNotes();
      setId(null);
    };

    return (
        <div className="column">
        <NoteModal
          active={activeModal}
          handleModal={handleModal}
          token={token}
          id={id}
          setErrorMessage={setErrorMessage}
        />
        { isPrivate === true ? <button className="button is-fullwidth mb-5 is-primary" onClick={() => setActiveModal(true)}>
          Create Note
        </button>: <></>}
        <ErrorMessage message={errorMessage} />
        {loaded && notes ? (
        <table className="table is-fullwidth">
          <thead>
            <tr>
              <th>Title</th>
              <th>Contents</th>
              { isPrivate !== true ? <th>Owner</th>: <></>}
              <th>Date</th>
              <th/>
              <th/>
            </tr>
          </thead>
          <tbody>
            {notes.map((note) => (
              <tr key={note.note_uuid} onClick={() => handleUpdate(note.note_uuid)}>
                <td>{note.title}</td>
                <td>{note.contents}</td>
                { isPrivate !== true ? <td>{note.owner.username}</td>: <></>}
                { note.created !== note.modified ? (<td> Modified {moment(note.modified).format("DD.MM.YYYY HH:mm")}</td>) : (<td>Created {moment(note.created).format("DD.MM.YYYY HH:mm")}</td>)}
                <td>
                  { isPrivate === true ? <button className="delete mr-2" onClick={() => handleDelete(note.note_uuid)}/>: <></>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        ) : (
            <p>Loading</p>
        )}
        </div>
    );
};

export default Notes;