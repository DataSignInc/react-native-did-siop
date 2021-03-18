import {Platform} from 'react-native';
import SInfo from 'react-native-sensitive-info';

const IOS_KEYCHAIN_SERVICE_NAME = 'paspit-login';
const KEY_ID = 'com.paspit-private-key';

const getOptions = (
  isFingerprintAvailable: boolean,
  isFaceAvailable: boolean,
) => {
  const authnOptions = {
    touchID: isFingerprintAvailable,
    showModal: true,
    kSecAccessControl: isFaceAvailable
      ? ('kSecAccessControlBiometryAny' as const)
      : undefined, // support FaceID on iOS
  };
  return {
    sharedPreferencesName: 'mySharedPrefs',
    keychainService: IOS_KEYCHAIN_SERVICE_NAME,
    ...authnOptions,
  };
};

const isAndroid = () => Platform.OS === 'android';
const isOS = () => Platform.OS === 'ios';

export const getFeatureAvailability = async () => {
  return {
    isSensorAvailable: await SInfo.isSensorAvailable(),
    // check if any fingerprints are registered on this device.
    hasEnrolledFingerprints: isAndroid()
      ? await SInfo.hasEnrolledFingerprints()
      : true,
  };
};

const isFingerprintAvailable = async () => {
  const {
    isSensorAvailable,
    hasEnrolledFingerprints,
  } = await getFeatureAvailability();
  return (
    (isSensorAvailable === true || isSensorAvailable === 'Touch ID') &&
    hasEnrolledFingerprints
  );
};

const isFaceAvailable = async () => {
  const {
    isSensorAvailable,
    hasEnrolledFingerprints,
  } = await getFeatureAvailability();
  return isSensorAvailable === true || isSensorAvailable === 'Face ID';
};

export const setItem = async (key: string, value: string) => {
  console.log('Setting item...');
  // const value = new Date().toISOString();
  const savingFirstData = await SInfo.setItem(
    key,
    value,
    getOptions(await isFingerprintAvailable(), await isFaceAvailable()),
  );
  console.log(savingFirstData); //value1
};

export const getItem = async (key: string) => {
  // console.log('Getting item...');
  const options = {
    ...getOptions(await isFingerprintAvailable(), await isFaceAvailable()),
    kSecUseOperationPrompt:
      'We need your permission to retrieve encrypted data',
    strings: {
      // optional (Android) - You can personalize your prompt
      description: 'Custom Title ',
      header: 'Custom Description',
    },
  };
  // debug(options);
  const gettingFirstData = await SInfo.getItem(key, options);
  // console.log(gettingFirstData); //value1
  return gettingFirstData;
};
