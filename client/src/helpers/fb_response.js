function fb_response(response) {
    axios.post('');
    //monitor
    console.log("in response");
    //view response
    console.log(response);
    if(!login) {
        setData(response);
        setPicture(response.picture.data.url);
        if (response.accessToken) {
        setLogin(true);
        } else {
        setLogin(false);
        }
    //send request with this body
    const payload = {
      fbid: response.id,
      name: response.name,
      picture: picture,
      email: response.email,
    }

    axios({
      url: '/api/save-user',
      method: 'POST',
      data: payload
    }).catch((e) => {
        console.log("Error saving user: ", e);
    });
    } else {

    }
}

export default fb_response();