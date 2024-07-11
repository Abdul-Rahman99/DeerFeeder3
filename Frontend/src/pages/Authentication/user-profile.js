import React, { useState, useEffect } from "react";
import { isEmpty } from "lodash";


import axios from "axios";
import { api } from "../../config";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  Button,
  Label,
  Input,
  FormFeedback,
  Form,
  Spinner
} from "reactstrap";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

//redux
import { useSelector, useDispatch } from "react-redux";

import avatar from "../../assets/images/users/avatar-1.jpg";
// actions
import { editProfile, resetProfileFlag } from "../../store/actions";
import { createSelector } from "reselect";

const UserProfile = () => {
  const dispatch = useDispatch();

  const [idx, setidx] = useState("");
  const [token, setToken] = useState("");
  const [status, setStatus] = useState("");

  const [fname, setFname] = useState()
  const [lname, setLname] = useState()
  const [username, setUsername] = useState()
  const [email, setEmail] = useState()

  const [errors, setErrors] = useState()

  const selectLayoutState = (state) => state.Profile;
  const userprofileData = createSelector(
    selectLayoutState,
    (userpro) => ({
      user: userpro.user,
      success: userpro.success,
      error: userpro.error
    })
  );

  // Inside your component
  const {
    user,
    success,
    error
  } = useSelector(userprofileData);

  useEffect(() => {
    const pic = JSON.parse(sessionStorage.getItem("profile_picture"));
    if (pic) {
      setUserprofile_picture(pic);
    }
    if (sessionStorage.getItem("authUser")) {
      const obj = JSON.parse(sessionStorage.getItem("authUser"));


      setFname(obj.data.first_name || '')
      setLname(obj.data.last_name || '')
      setUsername(obj.data.username || '')
      setEmail(obj.data.email || '')
      setidx(obj.data.id || '');
      setToken(obj.token || '');
      setStatus(obj.status || '');


      setTimeout(() => {
        dispatch(resetProfileFlag());
      }, 3000);
    }
  }, [dispatch, user]);

  const updateSessionStorage = (v) => {
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    obj.data.first_name = v.first_name;
    obj.data.last_name = v.last_name;
    obj.data.username = v.username
    obj.data.email = v.email
    obj.data.id = idx
    obj.token = token
    obj.status = status
    sessionStorage.removeItem("authUser");
    sessionStorage.setItem("authUser", JSON.stringify(obj));

  }


  const getProfilePicture = async () => {
    const obj = JSON.parse(sessionStorage.getItem("authUser"));

    axios.get(api.API_URL + "/api/getProfilePicture/" + obj.data.id)
      .then(res => {
        if (res.data) {

          sessionStorage.removeItem("profile_picture");

          let profile_picture = api.API_URL + '/uploads/' + res.data.file_path
          setUserprofile_picture(profile_picture);
          sessionStorage.setItem("profile_picture", JSON.stringify(profile_picture));
        }
      }).catch(err => {
        setErrors(err);
        console.log("users", "1", err)
      })
  }

  const [isImageUpload, setIsImageUpload] = useState(false);
  const [image, setImage] = useState(null);

  const [userprofile_picture, setUserprofile_picture] = useState("");

  const uploadImage = () => {

    const obj = JSON.parse(sessionStorage.getItem("authUser"));


    const formData = new FormData();
    formData.append('image', image);
    formData.append('userId', obj.data.id);
    axios.post(api.API_URL + "/api/uploadProfilePicture", formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Set the content type to multipart/form-data
      },
    })
      .then(res => {

        toast(res, { position: "top-right", hideProgressBar: true, closeOnClick: false, className: 'bg-success text-white' });
        setIsImageUpload(false)
        setImage(null)
        const fileInput = document.getElementById('fileInput');
        if (fileInput) {
          fileInput.value = ''; // Reset the file input value
        }
        getProfilePicture();
      })
      .catch(err => {
        setErrors(err);
        console.log("users", "1", err);
      });
  }
  const cancelUploadImage = () => {
    setIsImageUpload(false)
    setImage(null)
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
      fileInput.value = ''; // Reset the file input value
    }
  }
  const handleFileInputChange = (e) => {
    // Handle the file input change here
    const selectedFile = e.target.files[0];
    setImage(selectedFile)
  };

  const [isEditable, setisEditable] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      first_name: fname,
      last_name: lname,
      username: username,
      email: email,
       password: '',
      confirm_password: ''
    },
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .email('Please enter a valid email address')
        .required('Please enter your email'),
      first_name: Yup.string().required('Please enter your first name'),
      last_name: Yup.string().required('Please enter your last name'),
      username: Yup.string().required('Please enter your user name'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters'),
       confirm_password: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match'),
    }),
    onSubmit: (values) => {
      axios.post(api.API_URL + "/api/updateUserProfile",
        {
          isNew: false,
          id: idx,
          fname: values.first_name,
          lname: values.last_name,
          email: values.email,
          username: values.username,
          password: values.password

        })
        .then(res => {
          if (res && res.status == true) {

            toast(`User Updated Successfully`, { position: "top-right", hideProgressBar: true, closeOnClick: false, className: 'bg-success text-white' });

            setErrors("");

            updateSessionStorage(values);
            setisEditable(false)
          } else {
            setErrors(res);
            console.log("users", "0", res)
          }
        }).catch(err => {
          setErrors(err);
          console.log("users", "1", err)
        })
    }
  });


  const cancelUpdate = () => {
    setisEditable(false)
    validation.resetForm();
  }

  const updateDetails = () => {
    setisEditable(true)
  }



  document.title = "Profile | Deer Feeder";
  return (
    <React.Fragment>
      <ToastContainer />
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <div className="d-flex">

                    <div className="mx-3">
                      <img
                        src={userprofile_picture || avatar}
                        alt=""
                        className="avatar-md rounded-circle img-thumbnail"
                      />
                    </div>
                    <div className="flex-grow-1 align-self-center">
                      <div className="text-muted">
                        <h5>{username || "Admin"}</h5>
                        <p className="mb-1">Email Id : {email}</p>
                        <p className="mb-0">Id No : #{idx}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3" style={{ display: !isImageUpload ? 'block' : 'none' }}>
                    <button

                      onClick={() => setIsImageUpload(true)}
                      className="btn btn-small btn-success px-1 py-1 chip"
                    >
                      Change Image
                    </button>

                  </div>
                  <div className="mt-3 " style={{ display: isImageUpload ? 'block' : 'none' }}>
                    <input type="file" id="fileInput" onChange={handleFileInputChange} />
                    <div className="flex mt-2">
                      <button
                        onClick={() => cancelUploadImage()}
                        className="btn btn-small btn-warning px-1 py-1 chip "
                      >
                        Cancel
                      </button>
                      <button
                        style={{ display: image ? 'inline-flex' : 'none' }}
                        onClick={() => uploadImage()}
                        className="btn btn-small btn-success px-1 py-1 chip mx-2"
                      >
                        Upload
                      </button>
                    </div>
                  </div>


                </CardBody>
              </Card>
            </Col>
          </Row>

          <h4 className="card-title mb-4">Profile Details</h4>

          <Card>
            <CardBody>

              <div className="form-group">



                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    validation.handleSubmit();
                    return false;
                  }}
                  className="needs-validation" action="#">



                  <Row className="mt-2">
                    <Col xl={6}>
                      <Label htmlFor="useremail" className="form-label">First Name <span className="text-danger">*</span></Label>
                      <Input
                        id="first_name"
                        name="first_name"
                        className="form-control"
                        placeholder="Enter first name"
                        disabled={!isEditable}
                        type="text"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.first_name || ""}
                        invalid={
                          validation.touched.first_name && validation.errors.first_name ? true : false
                        }
                      />
                      {validation.touched.first_name && validation.errors.first_name ? (
                        <FormFeedback type="invalid"><div>{validation.errors.first_name}</div></FormFeedback>
                      ) : null}

                    </Col>
                    <Col xl={6}>
                      <Label htmlFor="useremail" className="form-label">Last Name <span className="text-danger">*</span></Label>
                      <Input
                        id="last_name"
                        disabled={!isEditable}
                        name="last_name"
                        className="form-control"
                        placeholder="Enter last name"
                        type="text"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.last_name || ""}
                        invalid={
                          validation.touched.last_name && validation.errors.last_name ? true : false
                        }
                      />
                      {validation.touched.last_name && validation.errors.last_name ? (
                        <FormFeedback type="invalid"><div>{validation.errors.last_name}</div></FormFeedback>
                      ) : null}

                    </Col>
                  </Row>


                  <Row className="mt-2">
                    <Col xl={6}>


                      <Label htmlFor="useremail" className="form-label">Email <span className="text-danger">*</span></Label>
                      <Input
                        id="email"
                        name="email"

                        disabled={!isEditable}
                        className="form-control"
                        placeholder="Enter email"
                        type="email"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.email || ""}
                        invalid={
                          validation.touched.email && validation.errors.email ? true : false
                        }
                      />
                      {validation.touched.email && validation.errors.email ? (
                        <FormFeedback type="invalid"><div>{validation.errors.email}</div></FormFeedback>
                      ) : null}

                    </Col>
                    <Col xl={6}>
                      <Label htmlFor="username" className="form-label">User Name  <span className="text-danger">*</span></Label>
                      <Input
                        name="username"
                        type="text"
                        disabled={!isEditable}
                        placeholder="Enter user name"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.username || ""}
                        invalid={
                          validation.touched.username && validation.errors.username ? true : false
                        }
                      />
                      {validation.touched.username && validation.errors.username ? (
                        <FormFeedback type="invalid"><div>{validation.errors.username}</div></FormFeedback>
                      ) : null}
                    </Col>

                  </Row>

                  <Row className="mt-2">
                  <Col xl={6}>  <div className="mb-3">
                                <Label htmlFor="userpassword" className="form-label">Password <span className="text-danger">*</span></Label>
                                <Input
                                    name="password"
                                    type="password"
                                    placeholder="Enter password"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.password || ""}
                                    invalid={
                                        validation.touched.password && validation.errors.password ? true : false
                                    }
                                />
                                {validation.touched.password && validation.errors.password ? (
                                    <FormFeedback type="invalid"><div>{validation.errors.password}</div></FormFeedback>
                                ) : null}

                            </div> </Col>
                            <Col xl={6}>
                                <div className="mb-2">
                                    <Label htmlFor="confirmPassword" className="form-label">Confirm Password <span className="text-danger">*</span></Label>
                                    <Input
                                        name="confirm_password"
                                        type="password"
                                        placeholder="Confirm password"
                                        onChange={validation.handleChange}
                                        onBlur={validation.handleBlur}
                                        value={validation.values.confirm_password || ""}
                                        invalid={
                                            validation.touched.confirm_password && validation.errors.confirm_password ? true : false
                                        }
                                    />
                                    {validation.touched.confirm_password && validation.errors.confirm_password ? (
                                        <FormFeedback type="invalid"><div>{validation.errors.confirm_password}</div></FormFeedback>
                                    ) : null}

                                </div> 
                                </Col>


                  </Row>

                  <Row className="mt-2">
                    <Col xl={4}>
                    </Col>
                    <Col xl={4}>
                      <div style={{ display: isEditable ? 'flex' : 'none' }} className="mt-4 flex items-center text-center justify-content-center">

                        <Button color="primary" disabled={error ? null : isLoading ? true : false} className="mx-1 btn btn-primary  " type="submit">
                          {error ? null : isLoading ? <Spinner size="sm" className='me-2'> Loading... </Spinner> : null}
                          Save
                        </Button>

                        <button className=" mx-1 btn btn-warning  " onClick={cancelUpdate} type="button">Cancel</button>

                      </div>

                      <div style={{ display: !isEditable ? 'flex' : 'none' }} className="mt-4 flex items-center text-center justify-content-center">

                        <button className=" mx-1 btn btn-success  " onClick={updateDetails} type="button">Change Profile Details</button>

                      </div>
                    </Col>
                    <Col xl={4}>
                    </Col>

                  </Row>



                </Form>


              </div>


            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default UserProfile;
