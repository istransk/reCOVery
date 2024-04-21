import { Platform,StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      ios: {
        marginBottom: 20,
      },
    }),
    marginTop: 50,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    width: '100%',
    color: 'grey',
  },
  crashButton: {
    position: 'absolute',
    top: 100,
    backgroundColor: 'white', 
    borderColor: 'grey', 
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
    height: 50,
  },
  bottomButton: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'grey',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  button: {
    marginTop: 30,
    margin: 10,
    backgroundColor: '#CCCCCC', // Grey background color
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.25, 
    shadowRadius: 4, 
    elevation: 3, // Android elevation for shadow
  },
  hasCrashed: {
    backgroundColor: '#8B0000', // Change background color to red
  },
  buttonText: {
    fontSize: 20, // Adjust font size
    color: '#333333', // Change text color to black
  },
  bottomButtonText:{
    color: 'white',
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
    backgroundColor: '#E0E0E0',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CCCCCC',
  },

  text: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'left',
  },
  buttonGradeContainer: {
    flexDirection: 'row', // Arrange buttons horizontally
    justifyContent: 'center', // Center buttons horizontally
    marginTop: 20, // Add margin at the top for spacing
  },
});
  
export default styles;