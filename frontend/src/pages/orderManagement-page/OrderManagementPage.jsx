import { useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainHeader from '../../components/header-main/MainHeader';
import Footer from '../../components/footer/Footer';
import OrderCard from './OrderCard';
import useGetUserOrders from '../../hooks/useGetUserOrders';
import Loading from '../../components/loading/Loading';
import { UserAuthContext } from '../../context/UserAuthContext';
import { toast } from 'react-toastify';
import './orderManagementPage.css';

const UserProfilePage = () => {
    const { sellerUser } = useParams();
    const { token } = useContext(UserAuthContext);
    const { loading, error, userOrders } = useGetUserOrders(sellerUser, token);
    const userInfo = userOrders?.ordersInfo;
    const avgRating = userOrders?.rating?.userAvgReviews;
    const navigate = useNavigate();

    useEffect(() => {
        if (token === '' || !token) {
            navigate('/user/login');
        }
    }, []);

    useEffect(() => {
        const checkingOrders = async () => {
            try {
                if (loading) {
                    <Loading />;
                    if (!userOrders?.ordersInfo) {
                        toast.error('No has recibido ninguna oferta por tus productos, te notificaremos cuando alguien muestre interés.');
                        navigate('/');
                    }
                }
            } catch (error) {
                toast.error(error.message);
            }
        };
        checkingOrders();
    }, []);

    if (error) {
        toast.error(`${error}, te notificaremos cuando alguien muestre interés.`);
        navigate('/');
    }

    return (
        <>
            <MainHeader />
            <main>
                {
                    !error
                        ? <>
                            <section className='managed-order-sections'>
                                {
                                    userInfo && userInfo.some((order) => {
                                        return order.status === 'Pendiente';
                                    })
                                        ? <>
                                            <h2>Pendientes</h2>
                                            <ul id='pendingOrders'>
                                                {userInfo.filter((order) => order.status === 'Pendiente').map((order) => {
                                                    return <li key={order.id}>
                                                        <OrderCard order={order} avgRating={avgRating} />
                                                    </li>;
                                                })}
                                            </ul>
                                        </>
                                        : null
                                }
                            </section>
                            <section className='managed-order-sections'>
                                {
                                    userInfo && userInfo.some((order) => {
                                        return order.status === 'Rechazado';
                                    })
                                        ? <>
                                            <h2>Rechazadas</h2>
                                            <ul id='rejetedOrders'>
                                                {userInfo.filter((order) => order.status === 'Rechazado').map((order) => {
                                                    return <li key={order.id}><OrderCard order={order} avgRating={avgRating} /></li>;
                                                })}
                                            </ul>
                                        </>
                                        : null
                                }
                            </section>
                            <section className='managed-order-sections'>
                                {
                                    userInfo && userInfo.some((order) => {
                                        return order.status === 'Aceptado';
                                    })
                                        ? <>
                                            <h2>Aceptadas</h2>
                                            <ul id='rejetedOrders'>
                                                {userInfo.filter((order) => order.status === 'Aceptado').map((order) => {
                                                    return <li key={order.id}><OrderCard order={order} avgRating={avgRating} /></li>;
                                                })}
                                            </ul>
                                        </>
                                        : null
                                }
                            </section>
                        </>
                        : null
                }
            </main>
            <Footer />
        </>
    );
};

export default UserProfilePage;
