import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

function Display(props) {
  const useStyles = makeStyles({
    root: {
      minWidth: 275,
      width: 600,
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
  });
  const branch = JSON.parse(localStorage.getItem("referrer"));
  const classes = useStyles();
  return (
    <>
      <main
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "#ff3366",
        }}
      >
        <>
          <Card className={classes.root}>
            <CardContent>
              <Typography
                className={classes.title}
                color="textSecondary"
                gutterBottom
              >
                IFSC - {branch.ifsc} <hr />
              </Typography>
              <Typography variant="h5" component="h2">
                Branch - {branch.branch}
              </Typography>
              <Typography className={classes.pos} color="textSecondary">
                Address - {branch.address}
              </Typography>
              <Typography variant="body2" component="p">
                City - {branch.city}
                <br />
                District - {branch.district}
                <br />
                State - {branch.state}
              </Typography>
            </CardContent>
          </Card>
        </>
      </main>
    </>
  );
}

export default Display;
