import React, {useContext} from "react";
import Header from "../components/Header";
import Authorization from "../components/Authorization";
import Notes from "../components/Notes";

import { UserContext } from "../context/UserContext";

const Browse = () => {
    const [token] = useContext(UserContext);

    return (
      <>
        <Header/>
        <div className="columns">
          {!token ? (<Authorization/>) : <></>}
        </div>
        <div className="columns">
          <Notes isPrivate={false}/>
        </div>
      </>
    );
};

export default Browse;