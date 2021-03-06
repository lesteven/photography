import React,{Component} from 'react';
import { connect } from 'react-redux';
import {fetchData,postData} from '../../reduxModules/fetchThunk';
import Paginate from '../../sharedViews/paginate/Paginate.jsx';
import {editorAct} from '../../reduxModules/editorModule';
import {Editor, 
        EditorState, 
        RichUtils,
        convertToRaw,
        convertFromRaw} from 'draft-js';
import {styleMap,
        getBlockStyle,
        mediaBlockRenderer} from '../../sharedViews/blogComponents/mediaStyle.js';
import style from './blog.css';

/*
* Blog on client 
* Does not use SSR b/c draftjs is incompatible.
* (draftjs data has __proto__ which disappears after stringifying
* on server)
* Fetches data from server after mounting.
* Paginate changes url, for which comp will receive new props ->
* causing it to fetch new data according to input from the url
*/

class Blog extends Component{
   /* 
    static fetchData({ store }, url) {
        return store.dispatch(asyncEditorAct(`${url}/api/editor/data`));
    }
*/
    componentDidMount = () => {
        const {fetchData,editorAct} = this.props;
        // console.log(`/api/editor/data/${location.search}`);
        fetchData(`/api/editor/data/${location.search}`,editorAct);
    }
    componentWillReceiveProps(nextProps){
        const {fetchData,editorAct,location} = this.props;
        if(nextProps.location.search !== location.search){
            fetchData(`/api/editor/data/${nextProps.location.search}`,
                editorAct)
        }  
    }
    
    list(){
        let className = 'RichEditor-editor';
        const {converted} = this.props.editor;

        return converted.map(e => 
          <div key = {e._id} className='RichEditor-root'>
            <div className={className}>
            <Editor
                editorState={e.editor}
                blockStyleFn={getBlockStyle}
                blockRendererFn={mediaBlockRenderer}
                customStyleMap={styleMap}
                readOnly={true}
            />
            </div>
            <p className='date'> 
              {new Date(e.createdAt).toDateString()}</p>
          </div>
        )
    }
	blogID=()=>{
        const { converted } = this.props.editor;
        if(converted[0]){
            let obj ={};
            let blog = converted;
            obj.new = blog[0]._id;
            obj.old = blog[blog.length-1]._id;
            return obj;
        }
        else{
            return {};
        }
	}
    render(){
    const {path} = this.props.match;
    const {converted, pagination} = this.props.editor;
        return(
            <div className='mainBlogs'>
                {converted?this.list():null}         
                {converted? <Paginate page = {pagination} path = {path} 
                    modelID={this.blogID}/> 
                    :null}
            </div>
        )
    }

}

const mapStateToProps = ({richEditor}) =>{
	return{
		editor: richEditor,
	};
};

const mapDispatchToProps = (dispatch) =>{
	return{
		fetchData:(url,actFunc)=>dispatch(fetchData(url,actFunc)),
		postData:(url,method,data,actFunc)=>
            dispatch(postData(url,method,data,actFunc)),
		editorAct:(editor)=>dispatch(editorAct(editor))	
	}
}
export default connect(mapStateToProps,mapDispatchToProps)(Blog);
