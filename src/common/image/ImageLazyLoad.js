import React from 'react';
import PropTypes from 'prop-types';
import Loading from '../loading';

const propTypes = {
  imageUrl: PropTypes.string.isRequired,
};

class ImageLazyLoad extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      imageUrl: props.imageUrl,
      imageList: [],
      loadedCount: 0,
      isShowLoading: false
    };
  }

  componentDidMount() {
    let { imageUrl } = this.state;
    this.loadImageAsync(imageUrl, (image) => {
      this.setState({imageUrl: image.src});
    });
  }

  componentWillReceiveProps(nextProps) {
    let newImageUrl = nextProps.imageUrl;
    if (this.isArrayEqual(newImageUrl, this.props.imageUrl)) return;
    this.loadImageAsync(newImageUrl, (image) => {
      this.setState({imageUrl: image.src});
    });
  }

  componentWillUnmount() {
    // prevent async operation
    this.setState = (state, callback) => {
      return;
    };
  }

  isArrayEqual = (array1, array2) => {
    return array1.toString() === array2.toString();
  }

  loadImageAsync = (url, resolve, reject) => {
    if (!url) {
      reject('img path is require');
      return;
    }
    this.setState({isShowLoading: true})
    const image = new Image();
    image.onload = () => {
      resolve(image);
      this.setState({isShowLoading: false})
    };
    image.onerror = () => {
      this.setState({isShowLoading: false})
    };
    image.src = url;
  }

  onMouseDown = (event) => {
    event.stopPropagation();
  }

  onImageClick = (event) => {
    this.props.onImageClick(event, 0);
  }

  render() {
    let { imageUrl, isShowLoading } = this.state;

    if (!imageUrl) {
      return '';
    }

    if (isShowLoading) {
      return <Loading />
    }
    return (
      <img 
        alt='' 
        src={imageUrl}
        onMouseDown={this.onMouseDown}
        onClick={this.onImageClick} 
      />
    );
  }
}

ImageLazyLoad.propTypes = propTypes;

export default ImageLazyLoad;