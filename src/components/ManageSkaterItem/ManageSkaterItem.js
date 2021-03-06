import React, {Component} from 'react';
import {Button, Paper, TextField, Grid, Dialog, DialogActions, DialogContentText, DialogContent} from '@material-ui/core';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import ReactPlayer from 'react-player/lazy'
import CreateIcon from '@material-ui/icons/Create';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import DeleteIcon from '@material-ui/icons/Delete';
import FastRewindIcon from '@material-ui/icons/FastRewind';


const styles = theme => ({
    root: {
        flexGrow: 1,
        alignItems: 'center'
    },
    paper: {
        width: '100%',
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    video :{
        maxWidth: '99%',
    },
    formControl: {
        minWidth: 200,
    },
    longField:{
        width: '85%',
    },
  });

class ManageSkaterItem extends Component {
  state = {
    notes:  '',
    submitted: false,
    open: false,
    };

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
      }
    
    componentDidMount(){
        if (this.props.skill.coach_notes){
            this.setState({
                ...this.state,
                notes:this.props.skill.coach_notes,
                submitted: true
            })
        } 
       // console.log(this.props.skill)
    }

    componentDidUpdate(previousProps){
        if (previousProps.skill.coach_notes !== this.props.skill.coach_notes){
            this.setState({
                ...this.state.open,
                notes: this.props.skill.coach_notes,
                submitted: true
            })
        }
    }
    
    submitNotes= () => {
        this.setState({
            ...this.state.notes,
            submitted: true
        })
        const submitObject = {
            user_id: this.props.skill.user_id,
            skill_id: this.props.skill.skill_id,
            notes: this.state.notes,
        };
        console.log(submitObject);
        //dispatch Saga with action type 'UPDATE_SKATER_NOTE'
        this.props.dispatch({type: 'UPDATE_COACH_NOTE', payload: submitObject})
    }  

    handleEdit = () => {
        this.setState({...this.state, submitted: false,})
    }

    handleDelete = () =>{
        const deleteObject = {
           user_id: this.props.skill.user_id,
           id:this.props.skill.id
        }
        console.log(deleteObject);
       
        this.props.dispatch({type: 'DELETE_USER_SKILL', payload: deleteObject})
        //dispatch saga to delete row from skater_skill
        this.handleClose();
         
    }

    handleOpen = () =>{
        this.setState({
            ...this.state,
            open: true
        })
    }
      
    handleClose = () =>{
        this.setState({
            ...this.state,
            open: false
        })
    }

  render() {
    const {classes} = this.props;
    return (
      <div className={classes.root}>
          <Grid container
                direction="row"
                justify="center"
                alignItems="center"
                spacing = {6}>
            <Grid item xs = {12} md= {11} lg = {10} xl = {9}>
                <Paper className = {classes.paper}>
                    <Grid container
                        direction="row"
                        justify="center"
                        alignItems="center"
                        spacing = {0}>
                        <Grid item xs = {12} md = {8}>
                            <Grid container
                                    direction="column"
                                    justify="center"
                                    alignItems="center">
                                <ReactPlayer url= {this.props.skill.url} 
                                    controls = {true} 
                                    alt = {this.props.skill.description} 
                                    className = {classes.video}/>
                                <br/>
                                <Button variant = "contained" color = "secondary"
                                    onClick = {this.handleOpen}>
                                        <DeleteIcon/>Remove skill
                                </Button> 
                            </Grid>
                        </Grid>
                        <Grid item xs = {12} md = {4}> 
                            <Grid container
                                direction="row"
                                justify="center"
                                alignItems="center"
                                spacing = {9}
                                >
                                    <Grid item xs = {12}>
                                        <h2>{this.props.skill.title}</h2>
                                        {this.state.submitted ?
                                         <>
                                            {<h4>Instructions</h4> &&
                                            <p>{this.state.notes}</p>}
                                         </>
                                      :
                                      <>
                                        <TextField
                                            label="instructions"
                                            name ='notes'
                                            value = {this.state.notes}
                                            onChange = {this.handleChange}
                                            multiline
                                            rowsMax="4"
                                            className={classes.longField}
                                            margin="normal"
                                            />
                                        <br/>
                                        </>}
                                        <br/>
                                        {this.state.submitted ?
                                            <Button variant = 'contained'
                                                onClick={this.handleEdit}>
                                               <CreateIcon/>Edit Instructions
                                            </Button>
                                        :
                                            <Button variant = 'contained' color = 'primary'
                                                onClick  = {this.submitNotes}>
                                                <SaveAltIcon/> Save Instructions
                                            </Button>
                                        } 
                                    </Grid>
                                    <Grid item xs = {12} >
                                    { this.props.skill.skater_notes ?
                                        <>
                                        <h4>{this.props.skater.username}'s notes:</h4>
                                        <p>{this.props.skill.skater_notes}</p>
                                        </>
                                        : ''
                                        }
                                    <br/>
                                    </Grid>
                                </Grid>
                            </Grid>      
                     </Grid>
                </Paper>
            </Grid>
          </Grid>
          
          <Dialog
          open={this.state.open}
          onClose={this.handleClose}>
              <DialogContent>
                  <DialogContentText>
                     Are you sure you want to remove {this.props.skill.title} from {this.props.skater.username}'s curriculum?
                     (This will also delete any footage of {this.props.skater.username} completing this skill)
                  </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button variant = "outlined" color = "primary" onClick = {this.handleClose}>
                    <FastRewindIcon/> Oops, NO
                </Button>
                <Button variant = "outlined" color = "secondary" onClick = {this.handleDelete}>
                    <DeleteIcon/> YES, remove skill
                </Button>
              </DialogActions>
          </Dialog>
      </div>
    );
  }
}

ManageSkaterItem.propTypes = {
    classes: PropTypes.object.isRequired
  };
  
  const mapStateToProps = reduxState => ({
    reduxState,
  });
  
  export default withStyles(styles)(connect(mapStateToProps)(ManageSkaterItem));