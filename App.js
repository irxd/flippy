import React, {useState, useCallback} from 'react';
import {StyleSheet, Text, Button, View, Dimensions} from 'react-native';

import Pdf from 'react-native-pdf';
import DocumentPicker, {types} from 'react-native-document-picker';

const App = () => {
  const [fileResponse, setFileResponse] = useState([]);

  const handleDocumentSelection = useCallback(async () => {
    try {
      const response = await DocumentPicker.pick({
        presentationStyle: 'fullScreen',
        type: [types.pdf],
      });
      console.log(response);
      setFileResponse(response);
    } catch (err) {
      console.warn(err);
    }
  }, []);

  return (
    <View style={styles.container}>
      {fileResponse.map((file, index) => (
        <View>
          <Text
            key={index.toString()}
            style={styles.uri}
            numberOfLines={1}
            ellipsizeMode={'middle'}>
            {/* {file?.uri} */}
            {file?.name}
          </Text>
          {file && (
            <Pdf
              trustAllCerts={false}
              source={{
                uri: file?.uri,
                cache: true,
              }}
              onLoadComplete={(numberOfPages, filePath) => {
                console.log(`Number of pages: ${numberOfPages}`);
              }}
              onPageChanged={(page, numberOfPages) => {
                console.log(`Current page: ${page}`);
              }}
              onError={error => {
                console.log(error);
              }}
              onPressLink={uri => {
                console.log(`Link pressed: ${uri}`);
              }}
              style={styles.pdf}
              enablePaging={true}
              horizontal={true}
            />
          )}
        </View>
      ))}
      <Button title="Select 📑" onPress={handleDocumentSelection} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0.8,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 25,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default App;
