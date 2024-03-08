import React, {useContext} from "react";
import Header from "../components/Header";
import Authorization from "../components/Authorization";
import Notes from "../components/Notes";

import { UserContext } from "../context/UserContext";

const Home = () => {
    const [token] = useContext(UserContext);

    return (
      <>
        <Header/>
        <div className="columns">
          {!token ? (<Authorization/>) : <Notes isPrivate={true} />}
        </div>
      </>
    );
};

export default Home;