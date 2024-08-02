import React, { useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import { setUser } from "../redux/actions/setUserAction";

const Layout = (props) => {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get('user');

        props.setUser({
          id: data.id,
          namaLengkap: data.namaLengkap,
          foto: data.foto,
          bio: data.bio,
          username: data.username,
          email: data.email,
          role: data.role,
        });
      } catch (error) {
        null
      } 
    })();
  }, []);
  return (
    <div>
      {props.children}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user.user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setUser: (user) => dispatch(setUser(user))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Layout);