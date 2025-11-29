import React from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAppSelector } from '../../store/hooks';
import * as XLSX from 'xlsx';
import { FaFileExcel, FaFileCsv } from 'react-icons/fa';

export const VacationReports: React.FC = () => {
    const { items: vacations } = useAppSelector(state => state.vacations);

    const chartData = vacations
        .filter(v => v.followersCount > 0) 
        .map(v => ({
            destination: v.destination,
            followers: v.followersCount
        }))
        .sort((a, b) => b.followers - a.followers);

    const exportToCSV = () => {
        const csvContent = [
            ['Destination', 'Followers'],
            ...chartData.map(item => [item.destination, item.followers])
        ]
            .map(row => row.join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `vacation_followers_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(
            chartData.map(item => ({
                'Destination': item.destination,
                'Followers': item.followers
            }))
        );
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Followers Report');
        XLSX.writeFile(workbook, `vacation_followers_report_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    return (
        <Container className="mt-5 pb-5">
            <h2 className="text-primary fw-bold mb-4">Vacation Followers Report</h2>

            <Card className="mb-4 shadow-sm">
                <Card.Body>
                    <h5 className="mb-3">Export Data</h5>
                    <Row className="g-3">
                        <Col xs={12} md={6}>
                            <Button
                                variant="success"
                                className="w-100 d-flex align-items-center justify-content-center gap-2"
                                onClick={exportToCSV}
                            >
                                <FaFileCsv /> Export to CSV
                            </Button>
                        </Col>
                        <Col xs={12} md={6}>
                            <Button
                                variant="primary"
                                className="w-100 d-flex align-items-center justify-content-center gap-2"
                                onClick={exportToExcel}
                            >
                                <FaFileExcel /> Export to Excel
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <Card className="shadow-sm">
                <Card.Body>
                    <h5 className="mb-4">Followers by Destination</h5>
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="destination"
                                    angle={-45}
                                    textAnchor="end"
                                    height={100}
                                />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="followers" fill="#0d6efd" name="Followers" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="text-center text-muted py-5">
                            <p>No vacation data available. Add some vacations and get users to follow them!</p>
                        </div>
                    )}
                </Card.Body>
            </Card>

            <Card className="mt-4 shadow-sm">
                <Card.Body>
                    <h5 className="mb-3">Detailed Data</h5>
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Destination</th>
                                    <th>Followers</th>
                                </tr>
                            </thead>
                            <tbody>
                                {chartData.length > 0 ? (
                                    chartData.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.destination}</td>
                                            <td>{item.followers}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={2} className="text-center text-muted">No data available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};
