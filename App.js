import React, {useState, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import Pdf from 'react-native-pdf';
import DocumentPicker, {types} from 'react-native-document-picker';

const App = () => {
  const [fileResponse, setFileResponse] = useState([]);
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const handleDocumentSelection = useCallback(async () => {
    try {
      const response = await DocumentPicker.pick({
        presentationStyle: 'fullScreen',
        type: [types.pdf],
      });
      setFileResponse(response);
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert(err);
    }
  }, []);

  return (
    <View style={styles.container}>
      {fileResponse.length === 0 && (
        <TouchableOpacity
          onPress={handleDocumentSelection}
          style={styles.button}>
          <Text style={styles.buttonText}>Choose Document 📄 </Text>
        </TouchableOpacity>
      )}
      {fileResponse.map((file, index) => (
        <View>
          <Text
            key={index.toString()}
            style={styles.title}
            numberOfLines={1}
            ellipsizeMode={'middle'}>
            {file?.name}
          </Text>
          {file && (
            <>
              <Pdf
                trustAllCerts={false}
                source={{
                  uri: file?.uri,
                  cache: true,
                }}
                onLoadComplete={(numberOfPages, filePath) => {
                  setTotalPage(numberOfPages);
                }}
                onPageChanged={page => {
                  setCurrentPage(page);
                }}
                onError={error => {
                  // eslint-disable-next-line no-alert
                  alert(error);
                }}
                style={styles.pdf}
                enablePaging={true}
                horizontal={true}
              />
              <View style={styles.paginationContainer}>
                <TouchableOpacity
                  onPress={handleDocumentSelection}
                  style={styles.button}>
                  <Text style={styles.buttonText}>Choose Document 📄 </Text>
                </TouchableOpacity>
                <View style={styles.pagination}>
                  <Text style={styles.paginationText}>
                    {currentPage} / {totalPage}
                  </Text>
                </View>
              </View>
            </>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  title: {
    padding: 16,
    color: 'black',
    fontWeight: 'bold',
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'black',
    padding: 16,
    borderRadius: 24,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 2,
    display: 'flex',
    flexDirection: 'row',
    padding: 12,
    width: '100%',
    justifyContent: 'center',
  },
  pagination: {
    backgroundColor: 'black',
    marginLeft: 16,
    padding: 16,
    borderRadius: 24,
  },
  paginationText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default App;
