import React, { Component, Fragment } from 'react';
import DropZone from 'react-dropzone';
import { connect } from 'react-redux';
import { dropAct, uploadAct } from '../../reduxModules/uploadModule';


class DropImages extends Component {
  makeFormData = () => {
    const { dropAct, upload, uploadAct } = this.props;
    let formData = null;
    console.log(upload.accepted);
    if (upload.accepted[0]) {
      formData = new FormData();
      upload.accepted.map( f => formData.append(f.name, f));
      uploadAct(formData);
    }
  }
  render() {
  const { dropAct, upload } = this.props;
    return (
      <Fragment>
        <div className='drop-images'>
          <DropZone className='dropzone'
            accept='image/*'
             onDrop = {(accepted,rejected)=>
               { dropAct({accepted,rejected})}}>
            <p> Drag and drop images or click! </p>
          </DropZone>
        </div>
        <div className='uploaded-images'>
          <h2> Uploaded Images </h2>
          { upload.accepted.map(f => 
            <img key = {f.name} src= {f.preview} />) }
        </div>
        <button onClick = {this.makeFormData}> Upload! </button>
      </Fragment>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    upload: state.upload
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dropAct: (files) => dispatch(dropAct(files)), 
    uploadAct: (files) => dispatch(uploadAct(files)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DropImages);
