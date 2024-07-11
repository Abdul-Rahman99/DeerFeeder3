import React, { useEffect, useState } from 'react';
import { Card, CardBody, Col, Container, Input, Label, Row, Button, Form, FormFeedback, Alert, Spinner } from 'reactstrap';
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";

//redux
import { useSelector, useDispatch } from "react-redux";

import { Link } from "react-router-dom";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

// actions
import { apiError, loginUser, socialLogin, resetLoginFlag } from "../../store/actions";


import logoLight from "../../assets/images/pngwing.com.png";

import withRouter from '../../Components/Common/withRouter';
import { createSelector } from 'reselect';


const Login = (props) => {
    const dispatch = useDispatch();

    const loginState = (state) => state.Login;
    const loginData = createSelector(
        loginState,
        (u) => ({
            user: u.user,
            errorMsg: u.errorMsg,
            loading: u.loading,
            error: u.error,
        })
    );
    // Inside your component
    const {
        user,
        errorMsg,
        loading,
        error
    } = useSelector(loginData);






    const [userLogin, setUserLogin] = useState([]);
    const [passwordShow, setPasswordShow] = useState(false);

    const loginStatus = useSelector(state => state.Login);
    //useEffect(() => {
    // if (user && user) {
    //     const updatedUserData = process.env.REACT_APP_DEFAULTAUTH === "firebase" ? user.multiFactor.user.email : user.user.email;
    //     setUserLogin({
    //         email: updatedUserData,
    //         password: user.user.confirm_password ? user.user.confirm_password : ""
    //     });
    // }
    //}, [user]);

    const validation = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,

        initialValues: {
            email: userLogin.email || '',
            password: userLogin.password || '',
        },
        validationSchema: Yup.object({
            email: Yup.string().required("Please Enter Your Email"),
            password: Yup.string().required("Please Enter Your Password"),
        }),
        onSubmit: (values) => {
            dispatch(loginUser(values, props.router.navigate));
        }
    });

    const loginAs = (v) => {
        let val = {
            email: v === "admin" ? 'admin@gmail.com' : 'user@gmail.com',
            password: '123456',
        }
        dispatch(loginUser(val, props.router.navigate));
    }


    const signIn = type => {
        dispatch(socialLogin(type, props.router.navigate));
    };

    //handleTwitterLoginResponse
    // const twitterResponse = e => {}

    //for facebook and google authentication
    const socialResponse = type => {
        signIn(type);
    };

    useEffect(() => {
        if (error) {
            setTimeout(() => {
                dispatch(resetLoginFlag());
            }, 3000);
        }
    }, [dispatch, error]);




    document.title = "SignIn | Deer Feeding";
    return (
        <React.Fragment>
            <ParticlesAuth>
                <div className="auth-page-content">
                    <Container>
                        <Row>
                            <Col lg={12}>
                                <div className="text-center text-white-50">
                                    <div>

                                        <img src={logoLight} alt="" height="100" />

                                    </div>
                                </div>
                            </Col>
                        </Row>

                        <Row className="justify-content-center">
                            <Col md={8} lg={6} xl={5}>
                                <Card className="card-bg-fill">
                                    <CardBody>
                                        <div className="text-center">
                                            <h5 className="text-primary">Welcome Back !</h5>
                                            <p className="text-muted">Sign in to Deer Feeding</p>
                                        </div>
                                        {/* <div className="text-center flex align-center" >
                                            <Button color="primary" onClick={() => loginAs('admin')} disabled={error ? null : loginStatus.loading ? true : false} className="btn btn-primary mx-2 "  >
                                                {error ? null : loginStatus.loading ? <Spinner size="sm" className='me-2'> Loading... </Spinner> : null}
                                                Admin Login
                                            </Button>
                                            <Button color="primary" onClick={() => loginAs('user')} disabled={error ? null : loginStatus.loading ? true : false} className="btn btn-success mx-2 " >
                                                {error ? null : loginStatus.loading ? <Spinner size="sm" className='me-2'> Loading... </Spinner> : null}
                                                User Login
                                            </Button>
                                        </div> */}

                                        {error ? (<Alert color="danger"> {loginStatus.errorMsg} </Alert>) : null}
                                        <div className="p-2 mt-4">
                                            <Form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    validation.handleSubmit();
                                                    return false;
                                                }}
                                                action="#">

                                                <div className="mb-3">
                                                    <Label htmlFor="email" className="form-label">Email</Label>
                                                    <Input
                                                        name="email"
                                                        className="form-control"
                                                        placeholder="Enter email"
                                                        type="email"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}

                                                        invalid={
                                                            validation.touched.email && validation.errors.email ? true : false
                                                        }
                                                    />
                                                    {validation.touched.email && validation.errors.email ? (
                                                        <FormFeedback type="invalid">{validation.errors.email}</FormFeedback>
                                                    ) : null}
                                                </div>

                                                <div className="mb-3">
                                                    <div className="float-end">
                                                        <Link to="/forgot-password" className="text-muted">Forgot password?</Link>
                                                    </div>
                                                    <Label className="form-label" htmlFor="password-input">Password</Label>
                                                    <div className="position-relative auth-pass-inputgroup mb-3">
                                                        <Input
                                                            name="password"
                                                            type={passwordShow ? "text" : "password"}
                                                            className="form-control pe-5"
                                                            placeholder="Enter Password"
                                                            onChange={validation.handleChange}
                                                            onBlur={validation.handleBlur}
                                                            invalid={
                                                                validation.touched.password && validation.errors.password ? true : false
                                                            }
                                                        />
                                                        {validation.touched.password && validation.errors.password ? (
                                                            <FormFeedback type="invalid">{validation.errors.password}</FormFeedback>
                                                        ) : null}
                                                        <button className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted" type="button" id="password-addon" onClick={() => setPasswordShow(!passwordShow)}><i className="ri-eye-fill align-middle"></i></button>
                                                    </div>
                                                </div>

                                                <div className="form-check">
                                                    <Input className="form-check-input" type="checkbox" value="" id="auth-remember-check" />
                                                    <Label className="form-check-label" htmlFor="auth-remember-check">Remember me</Label>
                                                </div>

                                                <div className="mt-4">
                                                    <Button color="primary" disabled={error ? null : loginStatus.loading ? true : false} className="btn btn-primary w-100" type="submit">
                                                        {error ? null : loginStatus.loading ? <Spinner size="sm" className='me-2'> Loading... </Spinner> : null}
                                                        Sign In
                                                    </Button>
                                                </div>


                                            </Form>
                                        </div>
                                    </CardBody>
                                </Card>

                                <div className="mt-4 text-center">
                                    <p className="mb-0">Don't have an account ? <Link to="/register" className="fw-semibold text-primary text-decoration-underline"> Signup </Link> </p>
                                </div>

                            </Col>
                        </Row>
                    </Container>
                </div>
            </ParticlesAuth>
        </React.Fragment>
    );
};

export default withRouter(Login);