const styles = StyleSheet.create({
    container: {
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
      backgroundColor: 'white', // Change background color to white
      borderColor: 'grey', // Add border color
      borderWidth: 1, // Add border width
      borderRadius: 8, // Add border radius for rounded corners
      shadowColor: '#000', // Add shadow color
      shadowOffset: { width: 0, height: 2 }, // Add shadow offset
      shadowOpacity: 0.25, // Add shadow opacity
      shadowRadius: 4, // Add shadow radius
      elevation: 5, // Add elevation for Android shadow
      width: '80%', // Adjust width
      alignItems: 'center',
      justifyContent: 'center',
      height: 50,
    },
    resultsButton: {
      position: 'absolute',
      bottom: 0,
      backgroundColor: 'grey',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      height: 50,
    },
    hasCrashed: {
      backgroundColor: '#8B0000', // Change background color to red
    },
    buttonText: {
      fontSize: 20, // Adjust font size
      fontWeight: 'bold', // Add bold font weight
      color: 'black', // Change text color to black
    },
    menuText:{
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
  });
export default styles;