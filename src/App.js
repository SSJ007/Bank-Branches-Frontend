import React from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TablePagination from "@material-ui/core/TablePagination";
import { MenuItem, FormControl, Select } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import Button from "@material-ui/core/Button";
import { Switch, Route, Link } from "react-router-dom";
import Display from "./Display";
import AddIcon from "@material-ui/icons/Add";
import swal from "sweetalert";

function App() {
  return (
    <main className="App">
      <>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/:id" component={Display} />
        </Switch>
      </>
    </main>
  );
}

function Home() {
  // TABLE STYLING
  const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);

  const StyledTableRow = withStyles((theme) => ({
    root: {
      "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }))(TableRow);

  const useStyles = makeStyles((theme) => ({
    root: {
      minWidth: 275,
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
    table: {
      minWidth: 100,
    },
  }));
  // ----> TABLE STYLING <-----

  const [page, setPage] = React.useState(0);
  const [page2, setPage2] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rowsPerPage2, setRowsPerPage2] = React.useState(10);
  const [value, setValue] = React.useState("");
  const [banks, setBanks] = React.useState([]);
  const [branches, setBranches] = React.useState([]);
  const [city, setCity] = React.useState("all");
  const [favs, setFavs] = React.useState([]);
  const [display, setDisplay] = React.useState("bank_list");
  let timer = null;

  // FETCH BANK LIST
  React.useEffect(
    () =>
      fetch(
        "https://sanskar-fyle-challenge-backend.herokuapp.com/api/banks?limit=170"
      )
        .then((response) => response.json())
        .then((data) => {
          setBanks(data);
        }),
    []
  );
  // -----> FETCH BANK LIST <-----

  // FETCH BRANCH LIST
  React.useEffect(
    () =>
      fetch(
        "https://sanskar-fyle-challenge-backend.herokuapp.com/api/branches?limit=1000"
      )
        .then((response) => response.json())
        .then((data) => {
          setBranches(data);
        }),
    []
  );
  // -----> FETCH BRANCH LIST <-----

  // RETAIN FAVORITES ON PAGE REFRESH
  React.useEffect(() => {
    const data = localStorage.getItem("favs");
    if (data) {
      setFavs(JSON.parse(data));
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem("favs", JSON.stringify(favs));
  }, [favs]);
  // -----> RETAIN FAVORITES ON PAGE REFRESH <-----

  const navigateToFavorites = (page) => {
    setDisplay(page);
  };

  const emptyRowsFavs =
    rowsPerPage2 - Math.min(rowsPerPage2, favs.length - page2 * rowsPerPage2);
  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, branches.length - page * rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangePage2 = (event, newPage) => {
    setPage2(newPage);
  };

  const handleChangeRowsPerPage2 = (event) => {
    setRowsPerPage2(parseInt(event.target.value, 10));
    setPage2(0);
  };

  const Timer = (event) => {
    // console.log(event.target.value);
    setValue(event.target.value);
    clearTimeout(timer);
    timer = setTimeout(() => {
      onChange(event.target.value);
    }, 500);
  };

  // SEARCH
  const onChange = async (value) => {
    // setValue(event.target.value);
    if (value === "") {
      const url =
        city === "all"
          ? `https://sanskar-fyle-challenge-backend.herokuapp.com/api/branches?limit=1000`
          : `https://sanskar-fyle-challenge-backend.herokuapp.com/api/branches?limit=1000&city=${city}&q=`;
      await fetch(url)
        .then((response) => response.json())
        .then((data) => {
          setBranches(data);
        });
    } else if (value !== "") {
      const url =
        city === "all"
          ? `https://sanskar-fyle-challenge-backend.herokuapp.com/api/branches?limit=1000&q=${value}`
          : `https://sanskar-fyle-challenge-backend.herokuapp.com/api/branches?limit=1000&q=${value}&city=${city}`;
      await fetch(url)
        .then((response) => response.json())
        .then((data) => {
          setBranches(data);
        });
    }
  };
  // -----> SEARCH <-----

  // DROPDOWN CITY CHANGE
  const onCityChange = async (event) => {
    setCity(event.target.value);
    const url =
      event.target.value === "all"
        ? `https://sanskar-fyle-challenge-backend.herokuapp.com/api/branches?limit=1000`
        : `https://sanskar-fyle-challenge-backend.herokuapp.com/api/branches/?limit=1000&city=${event.target.value}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setBranches(data);
      });
  };
  // -----> DROPDOWN CITY CHANGE <-----

  const addFav = (branch) => {
    let temp = favs.find((item) => item.ifsc === branch.ifsc);
    if (temp) {
      swal("Already Marked as Favorite", "");
    } else {
      setFavs(favs.concat(branch));
    }
  };

  const removeFav = (branch) => {
    let temp = favs.find((item) => item.ifsc === branch.ifsc);
    if (temp) {
      setFavs(favs.filter((item) => item.ifsc !== branch.ifsc));
    } else {
      swal("Not Found in Favorites", "");
    }
  };
  const classes = useStyles();

  const BankList = () => (
    <>
      <input
        style={{
          border: "1px solid #dc004e",
          margin: "30px 0px 0px 150px",
          width: "600px",
          height: "45px",
          borderRadius: "5px",
          paddingLeft: "15px",
        }}
        placeholder="Search Bank details across IFSC, Branch, Address, City, District and State fields"
        value={value}
        onChange={Timer}
      />
      <FormControl
        className="app__dropdown"
        style={{ margin: "-50px 0px 0px 1065px", width: "300px" }}
      >
        <Select
          varient="outlined"
          onChange={onCityChange}
          value={city}
          style={{
            minWidth: 150,
            minHeight: 50,
            borderBottom: "1px solid blue",
          }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="bangalore">Bangalore</MenuItem>
          <MenuItem value="mumbai">Mumbai</MenuItem>
          <MenuItem value="pune">Pune</MenuItem>
          <MenuItem value="delhi">Delhi</MenuItem>
          <MenuItem value="nagpur">Nagpur</MenuItem>
        </Select>
      </FormControl>
      <TableContainer
        className="change"
        component={Paper}
        style={{
          marginTop: "60px",
          marginBottom: "30px",
          // width: "80%",
          // marginLeft: "150px",
        }}
      >
        <Table
          id="change1"
          className={classes.table}
          aria-label="customized table"
        >
          <TableHead>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                count={branches.length}
                page={page}
                onChangePage={handleChangePage}
                labelDisplayedRows={({ from, to, page }) =>
                  `${from}-${to} of Page ${page + 1}`
                }
                rowsPerPage={rowsPerPage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </TableRow>
            <TableRow>
              <StyledTableCell>Favorites</StyledTableCell>
              <StyledTableCell>Bank</StyledTableCell>
              <StyledTableCell>IFSC</StyledTableCell>
              <StyledTableCell>Branch</StyledTableCell>
              <StyledTableCell>Address</StyledTableCell>
              <StyledTableCell>City</StyledTableCell>
              <StyledTableCell>District</StyledTableCell>
              <StyledTableCell>State</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {branches
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((branch) => (
                <StyledTableRow key={branch.ifsc}>
                  <StyledTableCell>
                    <AddIcon
                      style={{ cursor: "pointer" }}
                      onClick={() => addFav(branch)}
                    />
                    <DeleteIcon
                      style={{ cursor: "pointer" }}
                      onClick={() => removeFav(branch)}
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <Link
                      key={branch.ifsc}
                      to={`/${branch.bank}`}
                      target="_blank"
                      onClick={() =>
                        localStorage.setItem("referrer", JSON.stringify(branch))
                      }
                      style={{
                        textDecoration: "none",
                        color: "DarkTurquoise",
                      }}
                    >
                      {banks[branch.bank - 1].name}
                    </Link>
                  </StyledTableCell>
                  <StyledTableCell>{branch.ifsc}</StyledTableCell>
                  <StyledTableCell>{branch.branch}</StyledTableCell>
                  <StyledTableCell>{branch.address}</StyledTableCell>
                  <StyledTableCell>{branch.city}</StyledTableCell>
                  <StyledTableCell>{branch.district}</StyledTableCell>
                  <StyledTableCell>{branch.state}</StyledTableCell>
                </StyledTableRow>
              ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                count={branches.length}
                page={page}
                onChangePage={handleChangePage}
                labelDisplayedRows={({ from, to, page }) =>
                  `${from}-${to} of Page ${page + 1}`
                }
                rowsPerPage={rowsPerPage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );

  const Favorites = () => (
    <>
      <TableContainer
        className="change"
        component={Paper}
        style={{
          marginTop: "60px",
          marginBottom: "30px",
          // width: "80%",
          // marginLeft: "150px",
        }}
      >
        <Table
          id="change1"
          className={classes.table}
          aria-label="customized table"
        >
          <TableHead>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[10, 20, 30]}
                count={favs.length}
                page={page2}
                onChangePage={handleChangePage2}
                rowsPerPage={rowsPerPage2}
                onChangeRowsPerPage={handleChangeRowsPerPage2}
              />
            </TableRow>
            <TableRow>
              <StyledTableCell>Remove</StyledTableCell>
              <StyledTableCell>IFSC</StyledTableCell>
              <StyledTableCell>Branch</StyledTableCell>
              <StyledTableCell>Address</StyledTableCell>
              <StyledTableCell>City</StyledTableCell>
              <StyledTableCell>District</StyledTableCell>
              <StyledTableCell>State</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {favs
              .slice(page2 * rowsPerPage2, page2 * rowsPerPage2 + rowsPerPage2)
              .map((branch) => (
                <StyledTableRow key={branch.ifsc}>
                  <StyledTableCell>
                    <DeleteIcon
                      style={{ cursor: "pointer" }}
                      onClick={() => removeFav(branch)}
                    />
                  </StyledTableCell>
                  <StyledTableCell>{branch.ifsc}</StyledTableCell>
                  <StyledTableCell>{branch.branch}</StyledTableCell>
                  <StyledTableCell>{branch.address}</StyledTableCell>
                  <StyledTableCell>{branch.city}</StyledTableCell>
                  <StyledTableCell>{branch.district}</StyledTableCell>
                  <StyledTableCell>{branch.state}</StyledTableCell>
                </StyledTableRow>
              ))}
            {emptyRowsFavs > 0 && (
              <TableRow style={{ height: 53 * emptyRowsFavs }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[10, 20, 30]}
                count={favs.length}
                page={page2}
                onChangePage={handleChangePage2}
                rowsPerPage={rowsPerPage2}
                onChangeRowsPerPage={handleChangeRowsPerPage2}
              />
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );

  return (
    <>
      <h1
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "20px",
          fontWeight: "400",
        }}
      >
        Fyle Coding Challenge - Bank Branches
      </h1>
      <main style={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          onClick={() => navigateToFavorites("bank_list")}
          variant="contained"
          color="primary"
          style={{ padding: "15px", marginLeft: "150px" }}
        >
          List of Banks
        </Button>
        <Button
          onClick={() => navigateToFavorites("favorites")}
          variant="contained"
          color="secondary"
          style={{ padding: "15px", marginRight: "150px" }}
        >
          Favorites
        </Button>
      </main>
      {display === "bank_list" && BankList()}
      {display === "favorites" && Favorites()}
    </>
  );
}

export default App;
