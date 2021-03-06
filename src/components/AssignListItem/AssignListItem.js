import React, {Component} from 'react';
import {Button, Paper, TextField, InputLabel, MenuItem, Select, FormControl, Grid, Snackbar, IconButton} from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import ReactPlayer from 'react-player/lazy'
import CloseIcon from '@material-ui/icons/Close';
import green from '@material-ui/core/colors/green';



const styles = theme => ({
    root: {
        flexGrow: 1,
        alignItems: 'center',
        justify:'center,'
    },
    paper: {
        width: '100%',
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        justify: 'center'
    },
    video :{
        maxWidth: '100%',
    },
    formControl: {
        minWidth: 200,
    },
    longField:{
        width: '85%',
    },
    success: {
        backgroundColor: green[600],
      },
  });

class AssignListItem extends Component {
  state = {
    selected: '',
    notes: '',
    submitted: false,
    lastSelected: '',
    favorite: false,
    };

    componentDidMount(){
        //dispatch saga to fetch username list
        //displatch saga to fetch skaters
        this.props.dispatch({type: 'GET_SKATER'}) 
        this.setState({
            ...this.state,
            favorite: this.props.skill.favorite
        })
    }
  
    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
      }

    handleAssign =()=>{
       const postObject = {skill_id: this.props.skill.id,
                            user_id: this.state.selected.id,
                            coach_notes: this.state.notes }
       console.log(postObject);
       //call saga to POST postobject to user_skill
       this.props.dispatch({type: 'ASSIGN_SKILL', payload: postObject}) 
       //alert user of successful assign
       this.setState({
            lastSelected: this.state.selected.username,
            selected: '',
            notes: '',
            submitted: true,})
    }

    //this handler banashes the snackbar
    handleOk = (event, reason) =>{
        if (reason === 'clickaway') {
            return;
          } else { 
              this.setState({
            ...this.state,  
            submitted: false,})
        }
    }

    handleFavorite = () => {
        this.setState({
            ...this.state,
            favorite: !this.state.favorite,
        })
        //dispatch a toggle saga 
        const id = this.props.skill.id;
        this.props.dispatch({type:'FAVORITE_SKILL', payload: id})
    }

  render() {
    const {classes} = this.props;
    return (
      <div className={classes.root}>
         <Grid container
            direction="row"
            justify="center"
            alignItems="center"
            spacing = {4}>
             <Grid item xs = {12} md ={11} xl = {10}>         
                <Paper className = {classes.paper}>
                    <Grid container
                        direction="row"
                        justify="center"
                        alignItems="center"
                        spacing = {1}>
                        <Grid item xs = {12} md = {8}>
                            <Grid container
                                direction="column"
                                justify="center"
                                alignItems="center">
                                <ReactPlayer url= {this.props.skill.url} 
                                    controls = {true} 
                                    alt = {this.props.skill.description} 
                                    className = {classes.video}/> 
                            </Grid>
                        </Grid>
                    <Grid item xs = {12} md = {4}> 
                        <Grid container
                            direction="row"
                            justify="flex-end"
                            alignItems="flex-start"
                            spacing = {0}>
                                <Checkbox icon={<FavoriteBorder />} 
                                    checkedIcon={<Favorite />} 
                                    value={this.state.favorite}
                                    onChange= {this.handleFavorite}
                                    checked = {this.state.favorite} />      
                        </Grid>
                        <h2>{this.props.skill.title}</h2>
                        <FormControl className={classes.formControl}>     
                        <InputLabel>Skater</InputLabel>
                            <Select
                                value = {this.state.selected}
                                onChange={this.handleChange}
                                inputProps={{
                                    name: 'selected', 
                                }}>
                                    <MenuItem value="">
                                    <em></em>
                                    </MenuItem>
                                    {/* populates list with all usernames from redux state */}
                                    {this.props.reduxState.allSkater.map((skater) =>(
                                        <MenuItem value={skater} key ={skater.id}>{skater.username}</MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                        <TextField
                            label="Notes"
                            name ='notes'
                            value = {this.state.notes}
                            onChange = {this.handleChange}
                            multiline
                            rowsMax="4"
                            className={classes.longField}
                            margin="normal"
                            />
                            <br/>
                            <br/>
                            <br/>
                        <Button variant = 'contained' color = 'primary' onClick = {this.handleAssign}>
                            Assign Skill
                        </Button>
                    </Grid>
                  </Grid>
                </Paper>
             </Grid>  
          </Grid>
          {/* This snackbar lets a use know they have assigned a skill */}
          <Snackbar className = {classes.success}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.submitted}
          autoHideDuration={6000}
          onClose={this.handleOk}
          cvariant="success"
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">
                Successfully assigned to {this.state.lastSelected}'s curriculum
              </span>}
          action={[
            <IconButton
              color="inherit"
              onClick={this.handleOk}
              key="close"
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </div>
    );
  }
}

AssignListItem.propTypes = {
    classes: PropTypes.object.isRequired
  };
  
  const mapStateToProps = reduxState => ({
    reduxState,
  });
  
  export default withStyles(styles)(connect(mapStateToProps)(AssignListItem));