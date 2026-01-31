/*
 *   File : file-selector.js
 *   Author URI : https://evoqins.com
 *   Description : file selector component
 *   Integrations : react-native-image-picker,react-native-document-picker,react-native-toast-message
 *   Version : v1.1
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  Keyboard,
  PermissionsAndroid,
  Image,
} from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';

// manual import
import { Styles, COLORS, CONSTANTS } from '../../../Theme';
import Icon from '../../../Assets/icon';
import { ImageSelectModal } from '../Modals';
import Images from '../../../Assets/Images';
import { AwsService } from '../../../Service';

type FileSelectorProps = {
  fileName?: string;
  error?: string;
  docType?: string;
  title?: string;
  profile_image?: boolean;
  onRemoveDoc?: string;
  onSelect: () => void;
  onClose: () => void;
};

const FileSelector: React.FC = (props: FileSelectorProps) => {
  // useState variable
  const [fileName, setFileName] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [selectModalVisible, setSelectModalVisible] = useState(false);

  //Function to open the image selection modal
  const _handleImageSelector = () => {
    Keyboard.dismiss();
    setSelectModalVisible(true);
  };

  //Function to close the image option modal
  const _handleImageModalClose = () => {
    setSelectModalVisible(false);
  };

  //handling the image selection
  const _handleImageSelect = (selectedSource: number) => {
    if (selectedSource == 1) {
      _handleCamera();
    } else if (selectedSource == 2) {
      _handleFileSelection();
    }
  };

  async function _handleCamera() {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
        title: 'Camera Permission',
        message: 'We need access to your camera to take pictures',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      });

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera permission denied');
        return;
      }
    }

    const options = {
      mediaType: 'photo',
      includeBase64: false,
      quality: 0.9,
      saveToPhotos: true,
    };

    const result = await launchCamera(options);
    console.log('result:', result);

    if (result.didCancel) {
      console.log('User cancelled camera');
      return;
    }
    if (result.errorCode) {
      console.log('Camera error:', result.errorMessage);
      return;
    }

    const asset = result.assets?.[0];
    if (!asset) return;

    const file = {
      name: asset.fileName || 'photo.jpg',
      uri: asset.uri,
      type: asset.type,
    };

    if (asset.fileSize && asset.fileSize > 5000000) {
      console.log('error');
    } else {
      console.log('file::', file);
      _uploadFile(file);
    }
  }

  // handle file selection
  async function _handleFileSelection() {
    setSelectModalVisible(false);
    const options = {
      saveToPhotos: true,
      mediaType: 'photo',
      includeBase64: false,
    };

    // image upload
    if (props.docType == 'image') {
      try {
        setTimeout(
          async () => {
            const document = await launchImageLibrary(options);
            console.log('document ::=>', document, typeof document);
            const file = {
              name: document != undefined && document.assets[0].fileName,
              uri: document.assets[0].uri,
              type: document.assets[0].type,
            };
            if (document.assets[0].fileSize > 5000000) {
              console.log('error');
            } else {
              _uploadFile(file);
            }
          },
          Platform.OS == 'android' ? 0 : 1000,
        );
      } catch (error) {
        console.log('error filePicker || catch ||', error);
      }
    }
  }

  const _uploadFile = async (file: any) => {
    setSelectModalVisible(false);
    setFileName(file.name);
    setImageUri(file.uri);

    // Define params required for AWS
    const awsParams = {
      key: file.name, // or whatever key AWS expects
      // any additional required params
    };

    // Example AWS URL (replace with actual if available)
    const AWS_URL = 'https://your-aws-bucket-endpoint.com/upload';

    console.log('Uploading file to AWS:', file);

    try {
      const response = await AwsService(awsParams, file, AWS_URL);
      console.log('AWS upload response:', response);
      if (response.status === 'ok') {
        console.log('File uploaded successfully:', file.uri);
        props.onSelect(file.uri); // send back file URI
      } else {
        console.log('AWS upload failed:', response.message);
      }
    } catch (err) {
      console.log('Error uploading file to AWS:', err);
    }
  };

  //handling the deleting of image/pdf
  const _handleClose = () => {
    setFileName('');
    setImageUri('');
    props.onRemoveDoc();
  };

  return (
    <View>
      <TouchableOpacity
        activeOpacity={CONSTANTS.activeOpacity}
        style={[props.profile_image != true && Styles.paddingTop24, Styles.rowCenter]}
        onPress={() => _handleImageSelector()}
      >
        {props.profile_image == true ? (
          <Image
            source={Images.edit_profile}
            style={[Styles.heightWidth32, Styles.marginTopMinus64, Styles.marginLeft120]}
          />
        ) : (
          <Icon
            name={'link-3-1'}
            size={CONSTANTS.Width16}
            color={COLORS.PRIMARY_COLOR}
            style={[Styles.marginRight8]}
          />
        )}

        <Text
          style={[Styles.fontSize14, Styles.lineHeight16, Styles.rubikRegular, Styles.colorPrimary]}
        >
          {props.title}
        </Text>
      </TouchableOpacity>
      {props.profile_image == false && fileName && (
        <View style={[Styles.row, Styles.paddingTop12]}>
          <Image
            source={{ uri: imageUri }}
            style={[Styles.width64, Styles.height64, Styles.borderRadius8]}
            resizeMode="cover"
          />

          <TouchableOpacity
            onPress={() => _handleClose()}
            style={[
              Styles.backgroundColorLightLavaRed,
              Styles.heightWidth16,
              Styles.marginLeftMinus8,
              Styles.marginTopMinus4,
              Styles.center,
              Styles.borderRadius12,
            ]}
          >
            <Icon
              name={'close'}
              size={CONSTANTS.Width12}
              color={COLORS.PURE_WHITE}
              style={[Styles.alignSelfCenter]}
            />
          </TouchableOpacity>
        </View>
      )}

      {/* text input error */}
      {(props.error && props.error.length) != 0 && (
        <View style={[Styles.marginTop2]}>
          <Text
            style={[
              Styles.rubikRegular,
              Styles.fontSize12,
              Styles.lineHeight16,
              Styles.colorLavaRed,
            ]}
            numberOfLines={1}
          >
            {'*'}
            {props.error}
          </Text>
        </View>
      )}

      {selectModalVisible && (
        <ImageSelectModal
          show={selectModalVisible}
          onClose={_handleImageModalClose}
          onSelect={_handleImageSelect}
        />
      )}
    </View>
  );
};

export default FileSelector;
