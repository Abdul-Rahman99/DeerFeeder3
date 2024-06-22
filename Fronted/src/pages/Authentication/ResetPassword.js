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
import { apiError, userResetPassword, socialLogin, resetLoginFlag } from "../../store/actions";


import logoLight from "../../assets/images/bird-feed.png";

import withRouter from '../../Components/Common/withRouter';
import { createSelector } from 'reselect';


const ResetPassword = (props) => {
    const dispatch = useDispatch();
    const selectLayoutState = (state) => state.Account;
    const selectLayoutProperties = createSelector(
        selectLayoutState,
        (layout) => ({
            user: layout.user,
            errorMsg: layout.errorMsg,
            loading: layout.loading,
            error: layout.error,
        })
    );
    // Inside your component
    const {
        user,
        errorMsg,
        loading,
        error
    } = useSelector(selectLayoutProperties);

    const [userReset, setUserLogin] = useState([]);
    const [passwordShow, setPasswordShow] = useState(false);
    const [passwordShow2, setPasswordShow2] = useState(false);

    const resetStatus = useSelector(state => state.Login);
    useEffect(() => {
        if (user && user) {
            const updatedUserData = process.env.REACT_APP_DEFAULTAUTH === "firebase" ? user.multiFactor.user.new_password : user.user.new_password;
            setUserLogin({
                new_password: updatedUserData,
                confirm_password: user.user.confirm_password ? user.user.confirm_password : ""
            });
        }
    }, [user]);

    const validation = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,

        initialValues: {
            code: userReset.code || '',
            new_password: userReset.new_password || '',
            confirm_password: userReset.confirm_password || '',
        },
        validationSchema: Yup.object({
            code: Yup.string().required("Please Enter the code "),
            new_password: Yup.string().required("Please Enter Your New Password"),
            confirm_password: Yup.string().required("Please Confirm Your Password"),
        }),
        onSubmit: (values) => {
            
            dispatch(userResetPassword(values, props.router.navigate));
        }
    });

  

    //handleTwitterLoginResponse
    // const twitterResponse = e => {}

    //for facebook and google authentication
    const socialResponse = type => {
      //  signIn(type);
    };

    useEffect(() => {
        if (error) {
            setTimeout(() => {
                dispatch(resetLoginFlag());
            }, 3000);
        }
    }, [dispatch, error]);


    document.title = "SignIn | Bird Feeding";
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
                                            <h5 className="text-primary">Reset Password</h5> 
                                        </div>
                                         
                                        {resetStatus.error? (<Alert color="danger"> {resetStatus.errorMsg} </Alert>) : null}
                                        <div className="p-2 mt-4">
                                            <Form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    validation.handleSubmit();
                                                    return false;
                                                }}
                                                action="#">

                                                <div className="mb-3">
                                                    <Label htmlFor="code" className="form-label">Code</Label>
                                                    <Input
                                                        name="code"
                                                        className="form-control"
                                                        placeholder="Enter code"
                                                        type="text"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}

                                                        invalid={
                                                            validation.touched.code && validation.errors.code ? true : false
                                                        }
                                                    />
                                                    {validation.touched.code && validation.errors.code ? (
                                                        <FormFeedback type="invalid">{validation.errors.code}</FormFeedback>
                                                    ) : null}
                                                </div>
                                                <div className="mb-3">
                                                    <Label htmlFor="new_password" className="form-label">New Password</Label>
                                                    <div className="position-relative auth-pass-inputgroup mb-3">
                                                    <Input
                                                        name="new_password"
                                                        className="form-control"
                                                        placeholder="Enter New password"
                                                        type={passwordShow2 ? "text" : "password"}
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}

                                                        invalid={
                                                            validation.touched.new_password && validation.errors.new_password ? true : false
                                                        }
                                                    />
                                                    {validation.touched.new_password && validation.errors.new_password ? (
                                                        <FormFeedback type="invalid">{validation.errors.new_password}</FormFeedback>
                                                    ) : null}
                                                      <button className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted" type="button" id="confirm_password-addon" onClick={() => setPasswordShow2(!passwordShow2)}><i className="ri-eye-fill align-middle"></i></button>
                                                      </div>    </div>

                                                <div className="mb-3">
                                                   
                                                    <Label className="form-label" htmlFor="confirm_password-input">Confirm Password</Label>
                                                    <div className="position-relative auth-pass-inputgroup mb-3">
                                                        <Input
                                                            name="confirm_password"
                                                            type={passwordShow ? "text" : "password"}
                                                            className="form-control pe-5"
                                                            placeholder="Re-Enter Password"
                                                            onChange={validation.handleChange}
                                                            onBlur={validation.handleBlur}
                                                            invalid={
                                                                validation.touched.confirm_password && validation.errors.confirm_password ? true : false
                                                            }
                                                        />
                                                        {validation.touched.confirm_password && validation.errors.confirm_password ? (
                                                            <FormFeedback type="invalid">{validation.errors.confirm_password}</FormFeedback>
                                                        ) : null}
                                                        <button className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted" type="button" id="confirm_password-addon" onClick={() => setPasswordShow(!passwordShow)}><i className="ri-eye-fill align-middle"></i></button>
                                                    </div>
                                                </div>
 

                                                <div className="mt-4">
                                                    <Button color="primary" disabled={error ? null : loading ? true : false} className="btn btn-primary w-100" type="submit">
                                                        {error ? null : loading ? <Spinner size="sm" className='me-2'> Loading... </Spinner> : null}
                                                        Save
                                                    </Button>
                                                </div>
                                                

                                            </Form>
                                        </div>
                                    </CardBody>
                                </Card>

                                

                            </Col>
                        </Row>
                    </Container>
                </div>
            </ParticlesAuth>
        </React.Fragment>
    );
};

export default withRouter(ResetPassword);