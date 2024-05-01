import { Platform,StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#dcc1a7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    ...Platform.select({
      ios: {
        marginBottom: 20,
      },
    }),
    marginTop: 50,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: '#dcc1a7',
  },
  contentList: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    flex: 1,
    marginBottom: 100,
    backgroundColor: '#dcc1a7',
  },
  iphoneBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 20, 
    backgroundColor: '#72665A',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    width: '100%',
    color: 'grey',
  },
  containerQuestions: {
    marginTop: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  crashButton: {
    position: 'absolute',
    top: 40,
    backgroundColor: '#F7E9E3', 
    borderColor: '#72665A', 
    borderWidth: 1, 
    borderRadius: 8, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.25, 
    shadowRadius: 4, 
    elevation: 5, 
    width: '80%', 
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
  },
  bottomButton: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#72665A',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  button: {
    marginTop: 10,
    marginBottom: 60,
    margin: 10,
    backgroundColor: '#72665A', 
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5c5249', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.25, 
    shadowRadius: 4, 
    elevation: 3, // Android elevation for shadow
  },
  buttonMenu: {
    width: '70%',
    height: 50,
    backgroundColor: '#72665A',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    shadowColor: '#5c5249',
    shadowOffset: { width: 2, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
  },
  gradeButton: {
    padding: 10,
    backgroundColor: '#72665A',
    borderRadius: 5,
  },
  gradeButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  symptomText: {
    fontSize: 30,
    textAlign: 'center',
  },
  questionContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 50,
    flex:1,
  },
  savedButtonContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    fley: 1,
  },
  saveButton: {
    position: 'absolute',
    bottom: 90,
    backgroundColor: '#72665A', 
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5c5249', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.25, 
    shadowRadius: 4, 
    elevation: 3, // Android elevation for shadow
  },
  commentInput: {
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 5,
    padding: 5,
    backgroundColor: '#F7E9E3',
    height: 150,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between',
  },
  hasCrashed: {
    backgroundColor: '#8B0000', // Change background color to red
  },
  crashButtonText: {
    fontSize: 40, 
    color: '#000'
  },
  buttonText: {
    fontSize: 20, 
    color: '#F7E9E3',
  },
  bottomButtonText:{
    color: '#F7E9E3',
    fontSize: 17,
    fontWeight: '300',
  },
  bgFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: 7, // Match border radius
  },

  rectangle: {
    backgroundColor: '#D0AC8A',
    padding: 20,
    borderRadius: 10,
  },

  text: {
    fontSize: 16,
    color: '#000',
    textAlign: 'left',
  },
  buttonGradeContainer: {
    flexDirection: 'row', // Arrange buttons horizontally
    justifyContent: 'center', // Center buttons horizontally
    marginTop: 20, // Add margin at the top for spacing
  }
});
  
export default styles;
