import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import Lightbox from '@seafile/react-image-lightbox';
import ModalPortal from '../modal-portal';

import '@seafile/react-image-lightbox/style.css';

const zIndexes = {
  IMAGE_PREVIEW_LIGHTBOX: 1051,
};

function checkDesktop() {
  return window.innerWidth >= 768;
}

ImagePreviewerLightbox.propTypes = {
  imageItems: PropTypes.array.isRequired,
  imageIndex: PropTypes.number.isRequired,
  closeImagePopup: PropTypes.func.isRequired,
  moveToPrevImage: PropTypes.func.isRequired,
  moveToNextImage: PropTypes.func.isRequired,
};

function ImagePreviewerLightbox(props) {
  const { imageItems, imageIndex } = props;
  const imageItemsLength = imageItems.length;
  const URL = imageItems[imageIndex];
  const imageTitle = URL ? URL.slice(URL.lastIndexOf('/') + 1, URL.indexOf('?')) : '';
  const isDesktop = checkDesktop();
  let overlay = {
    zIndex: zIndexes.IMAGE_PREVIEW_LIGHTBOX
  };
  let reactModalStyle = { overlay };
  if (!isDesktop) {
    Object.assign(overlay, {backgroundColor: '#000'});
  }

  const downloadImage = () => {
    let image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = function () {
      let canvas = document.createElement('canvas');
      canvas.width = this.naturalWidth;
      canvas.height = this.naturalHeight;
      canvas.getContext('2d').drawImage(this, 0, 0);

      let eleA = document.createElement('a');
      eleA.href = canvas.toDataURL('image/png');
      eleA.download = imageTitle;
      eleA.click();
    };
    image.src = URL;
  };

  return (
    <Fragment>
      <Lightbox
        imageTitle={imageTitle}
        mainSrc={imageItems[imageIndex]}
        nextSrc={imageItems[(imageIndex + 1) % imageItemsLength]}
        prevSrc={imageItems[(imageIndex + imageItemsLength - 1) % imageItemsLength]}
        onCloseRequest={props.closeImagePopup}
        onMovePrevRequest={props.moveToPrevImage}
        onMoveNextRequest={props.moveToNextImage}
        animationDisabled={true}
        reactModalStyle={reactModalStyle}
        enableZoom={isDesktop}
      />
      {!isDesktop && (
        <ModalPortal>
          <Button className="text-white position-fixed" style={{
            zIndex: zIndexes.IMAGE_PREVIEW_LIGHTBOX + 1,
            background: '#333', bottom: '20px', right:'20px'
          }} onClick={downloadImage}><span className="dtable-font dtable-icon-download"></span></Button>
        </ModalPortal>
      )}
    </Fragment>
  );
}

export default ImagePreviewerLightbox;
