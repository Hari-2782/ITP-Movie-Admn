import React, { useEffect, useState } from "react";
import "./dashboard.css";
import { FaShoppingCart } from "react-icons/fa";
import { AiFillSchedule } from "react-icons/ai";
import { PiBellFill } from "react-icons/pi";
import { ImUsers } from "react-icons/im";
import Chart from "react-apexcharts" ;
import Sidebar from "./Sidebar";
import Header from "./Header";
const AdminDashboard = ({ theme }) => {
    const [productCount, setProductCount] = useState(0);
    const [appointmentsCount, setAppointmentsCount] = useState(0);
    const [foodCount, setFoodCount] = useState(0);
    const [employeesCount, setEmployeesCount] = useState(0);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);
    const [beverageCount, setBeverageCount] = useState(0);
    const [drinkCount, setDrinkCount] = useState(0);
    const [snackCount, setSnackCount] = useState(0);
    const [foodallCount, setFoodallCount] = useState(0);
    const [finance, setFinance] = useState([]);

    const [financeChart, setFinanceChart] = useState({
        options: {},
        series: [],
        labels: [],
    });
    const [inventoryChart, setInventoryChart] = useState({
        options: {
            colors: [
                "#2E93fA",
                "#66DA26",
                "#546E7A",
                "#E91E63",
                "#FF9800",
                "#f0e802",
            ],
            chart: {
                id: "basic-bar",
            },
            xaxis: {
                categories: [""],
            },
        },
        series: [
            {
                name: "Food",
                data: [foodCount],
            },
            {
                name: "Beverage",
                data: [beverageCount],
            },
            {
                name: "Drink",
                data: [drinkCount],
            },
            {
                name: "Snack",
                data: [snackCount],
            },
        ],
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const movieResponse = await fetch("http://localhost:8000/movie/getall");
                const response = await movieResponse.json();
                setProductCount(response.data.length);

                const bookingResponse = await fetch("http://localhost:8000/booking/getall");
                const bookingsData = await bookingResponse.json();
                setAppointmentsCount(bookingsData.data.length);

                const foodResponse = await fetch('http://localhost:8000/food/getall');
                const foodsData = await foodResponse.json();
                setFoodallCount(foodsData.length);

                const employeeResponse = await fetch("http://localhost:8000/api/employee");
                const employees = await employeeResponse.json();
                setEmployeesCount(employees.length);
                const paymentResponse = await fetch('http://localhost:8000/payment/payments');
                const paymentsData = await paymentResponse.json();
                setFinance(paymentsData);
         console.log('pp',paymentsData)
                // Calculate total income and expenses from paymentsData
                let incomeTotal = 0;
                let expenseTotal = 0;
                paymentsData.payments.forEach((transaction) => {
                    if (transaction.paymentType === "CreditCard") {
                        incomeTotal += transaction.Totalamount;
                    } else if (transaction.paymentType === "PayPal") {
                        expenseTotal += transaction.Totalamount;
                    }
                });
                setTotalIncome(incomeTotal);
                setTotalExpense(expenseTotal);
                const foodInventoryResponse = await fetch('http://localhost:8000/food/getall');
                const foodInventory = await foodInventoryResponse.json();

                const counts = {
                    food: foodInventory.reduce((acc, item) => acc + item.items.filter(i => i.type === 'food').reduce((total, food) => total + food.quantity, 0), 0),
                    beverage: foodInventory.reduce((acc, item) => acc + item.items.filter(i => i.type === 'beverage').reduce((total, beverage) => total + beverage.quantity, 0), 0),
                    drink: foodInventory.reduce((acc, item) => acc + item.items.filter(i => i.type === 'drink').reduce((total, drink) => total + drink.quantity, 0), 0),
                    snack: foodInventory.reduce((acc, item) => acc + item.items.filter(i => i.type === 'snack').reduce((total, snack) => total + snack.quantity, 0), 0),
                };
                
                setFoodCount(counts.food);
                setBeverageCount(counts.beverage);
                setDrinkCount(counts.drink);
                setSnackCount(counts.snack);
                
                
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const incomePercentage = (
            (totalIncome / (totalIncome + totalExpense)) *
            100
        ).toFixed(2);
        const expensePercentage = (
            (totalExpense / (totalIncome + totalExpense)) *
            100
        ).toFixed(2);

        const balance = totalIncome - totalExpense;

        setFinanceChart({
            options: {
                colors: ["#2E93fA", "#66DA26", "#546E7A", "#E91E63", "#FF9800"],
                chart: {
                    type: "donut",
                    height: 350,
                },
                labels: ["Creditcard", "Paypal"],
                dataLabels: {
                    enabled: true,
                    formatter: function (val) {
                        return `${parseFloat(val).toFixed(2)}%`;
                    },
                },

                plotOptions: {
                    pie: {
                        donut: {
                            size: "70%",
                        },
                    },
                    total: {
                        show: true,
                        showAlways: true,
                        label: "Balance",
                        fontSize: "22px",
                        fontFamily: "Helvetica, Arial, sans-serif",
                        fontWeight: 600,
                        color: "black",
                        formatter: function (val) {
                            return val.globals.seriesTotals.reduce((a, b) => {
                                return a + b;
                            }, 0);
                        },
                    },
                },
            },
            series: [totalIncome, totalExpense],
        });
    }, [totalIncome, totalExpense]);

    useEffect(() => {
        setInventoryChart({
            ...inventoryChart,
            series: [
                {
                    name: "Food",
                    data: [foodCount],
                },
                {
                    name: "Beverage",
                    data: [beverageCount],
                },
                {
                    name: "Drink",
                    data: [drinkCount],
                },
                {
                    name: "Snack",
                    data: [snackCount],
                },
            ],
        });
    }, [foodCount, beverageCount, drinkCount, snackCount]);

    const [chartData, setChartData] = useState({
        options: {
            xaxis: {
                categories: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            },
            yaxis: {
                title: {
                    text: 'Sales',
                },
            },
        },
        series: [
            {
                name: 'Total Payments',
                data: [65, 59, 80, 81, 56, 55, 40],
            },
        ],
    });

    return (
        <div >
            <Header theme={theme}/>
              <div className={`dashboard-page ${theme}`}>
        <div className="dashboard-header">
          <div className="dashboard-header-left">
           
            {/* <h1>Dashboard</h1> */}
            <Sidebar theme={theme}/>
          </div>
        </div>
        <div className="dashboard-body">
          <div className="dashboard-summary">
            <div className="summary-block1">
                    Movies
                    <FaShoppingCart className="summary-block-icon" />
                    <p className="count">{productCount}</p>
                </div>
                <div className="summary-block2">
                     bookings
                    <AiFillSchedule className="summary-block-icon" />
                    <p className="count">{appointmentsCount}</p>
                </div>
                <div className="summary-block3">
                    Total food
                    <PiBellFill className="summary-block-icon" />
                    <p className="count">{foodallCount}</p>
                </div>
                <div className="summary-block4">
                    Employees
                    <ImUsers className="summary-block-icon" />
                    <p className="count">{employeesCount}</p>
                </div>
                </div>
                <div className="dashboard-charts">
                    <div className="chart1">
                        <Chart
                            options={financeChart.options}
                            series={financeChart.series}
                            type="donut"
                            width="400"
                        />
                    </div>
                    <div className="chart2">
                        <Chart
                            options={inventoryChart.options}
                            series={inventoryChart.series}
                            type="bar"
                            width="400"
                        />
                     
                </div>
                <div className="chart-container">
                <Chart
                    options={chartData.options}
                    series={chartData.series}
                    type="line"
                    width="400"
                />
            </div>
                
          </div>
         
        </div>
      </div>
    </div>
    );
};

export default AdminDashboard;
