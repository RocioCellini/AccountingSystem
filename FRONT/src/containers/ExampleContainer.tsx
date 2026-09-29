import React, { useEffect } from 'react'
import Home from '../views/pages/Home'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getExample } from '../redux/actions/example/example.actions';
import SpinnerComponent from '../components/@vuexy/spinner/Fallback-spinner';

const ExampleContainer = (props: any) => {
  const { data, getExampleAction, loading} = props

  useEffect(() => {
    getExampleAction();
  }, []);

  return !loading ? (
    <></>
  ) : (
    <SpinnerComponent />
  )
}

const mapStateToProps = (state: {
  home: any;
}) => ({
  loading: state.home.loading,
  data: state.home.data,
});

const mapDispatchToProps = (dispatch: any) => ({
  getExampleAction: bindActionCreators(getExample, dispatch),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExampleContainer);