import PropTypes from 'prop-types';
import UserWithRating from '../../components/user-with-rating/UserWithRating';
import MainButton from '../../components/main-button/MainButton';
import SecondaryButton from '../../components/secondary-button/SecondaryButton';
import ReadOnlyRating from '../../components/readOnly-rating/ReadOnlyRating';
import { rejectOrderService } from '../../service';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserAuthContext } from '../../context/UserAuthContext';
import './orderCard.css';

const OrderCard = ({ order, avgRating }) => {
    const navigate = useNavigate();
    const { token } = useContext(UserAuthContext);

    const { id: idOrder } = order;


    function handleAccept () {
        navigate(`/order/exchangeSet/${idOrder}`);
    }

    async function handleReject () {
        await rejectOrderService(token, idOrder);
        window.location.reload();
    }

    return (
        <article className='managed-order-article'>
            <img src={`${import.meta.env.VITE_BACK_URL}/uploads/${order.product_photo}`} alt="Foto del producto" />
            <div>
                <div className='manged-product-name'>
                    <h2>{order.product_name}</h2>
                    {
                        order.status === 'Pendiente'
                            ? <p className='price'>{order.price} €</p>
                            : null
                    }
                </div>
                <p>{order.description}</p>
                {
                    order.status === 'Pendiente'
                        ? <>
                            <div className='managed-order-buyer'>
                                <UserWithRating
                                    className='buyer-info'
                                    username={order.seller_first_name}
                                    lastName={order.seller_last_name}
                                    avatar={order.avatar}
                                    idUser={order.user_buyer_id} />
                                <ReadOnlyRating className='order-read-only-rating' value={avgRating}/>
                            </div>
                            <div className='managed-order-time'>
                                <p>{new Date(order.created_at).toLocaleDateString('es-ES', { month: 'long', day: '2-digit' })} de {new Date(order.created_at).getFullYear()}</p>
                                <div>
                                    <SecondaryButton text='Rechazar' handleClick={handleReject} />
                                    <MainButton text='Aceptar' handleClick={handleAccept}/>
                                </div>
                            </div>
                        </>
                        : null
                }
            </div>
        </article>
    );
};

OrderCard.propTypes = {
    order: PropTypes.object.isRequired,
    avgRating: PropTypes.number
};

export default OrderCard;
