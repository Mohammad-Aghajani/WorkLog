import React from 'react';
import
{
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    Animated
} from 'react-native'; //Step 1

// import { Icon } from 'react-native-elements';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

class Panel extends React.Component {
    constructor(props) {
        super(props);
        // this.icons = {     //Step 2
        //     up: require('./images/Arrowhead.png'),
        //     down: require('./images/Arrowhead-Down.png')
        // };
        this.icons = {
            up: 'arrow-up',
            down: 'arrow-down'
        };
        this.state = {       //Step 3
            title: props.title,
            expanded: false,
            // animation: new Animated.Value(),
            minHeight: '',
            maxHeight: '',
        };
    }

    toggle() {
        const initialValue = this.state.expanded ?
                                this.state.maxHeight + this.state.minHeight :
                                this.state.minHeight;
        const finalValue = this.state.expanded ?
                                this.state.minHeight :
                                this.state.maxHeight + this.state.minHeight;
    
        this.setState({
            expanded: !this.state.expanded
        });
    
        this.state.animation.setValue(initialValue);
        Animated.spring(     //Step 4
            this.state.animation,
            {
                toValue: finalValue
            }
        ).start();
    }

    setMaxHeight(event) {
        if (this.state.maxHeight === '') {
            this.setState({
                maxHeight: event.nativeEvent.layout.height
            });
        }
    }
    
    setMinHeight(event) {
        this.setState({
            minHeight: event.nativeEvent.layout.height,
            animation: new Animated.Value(event.nativeEvent.layout.height),
        });
    }


    render() {
        let icon = this.icons.down;

        if (this.state.expanded) {
            icon = this.icons.up;   //Step 4
        }

        //Step 5
        return (
            <Animated.View
                style={[styles.container, { height: this.state.animation }]}
            >
                <View style={styles.titleContainer} onLayout={this.setMinHeight.bind(this)}>
                    <TouchableHighlight 
                        style={{ flex: 1, flexDirection: 'column', padding: 10, }} 
                        onPress={this.toggle.bind(this)}
                        underlayColor="#f1f1f1"
                    >
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>
                                {this.state.title}
                            </Text>
                            <Icon
                                style={styles.buttonImage}
                                name={icon}
                            />
                        </View>
                    </TouchableHighlight>
                </View>
                
                <View style={styles.body} onLayout={this.setMaxHeight.bind(this)}>
                    {this.props.children}
                </View>
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    container:
    {
        backgroundColor: '#fff',
        margin: 10,
        overflow: 'hidden'
    },
    titleContainer:
    {
        flexDirection: 'row'
    },
    title: 
    {
        flex: 1,
        flexDirection: 'column',
        padding: 10,
        color: '#2a2f43',
        fontWeight: 'bold'
    },
    buttonImage:
    {
        width: 30,
        height: 25
    },
    body:
    {
        padding: 10,
        paddingTop: 0
    }
});

export default Panel;
