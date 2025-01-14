<?php
/**
 * Email Order Items
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/emails/email-order-items.php.
 *
 * HOWEVER, on occasion WooCommerce will need to update template files and you
 * (the theme developer) will need to copy the new files to your theme to
 * maintain compatibility. We try to do this as little as possible, but it does
 * happen. When this occurs the version of the template file will be bumped and
 * the readme will list any important changes.
 *
 * @see     https://woocommerce.com/document/template-structure/
 * @package WooCommerce\Templates\Emails
 * @version 9.7.0
 */

defined( 'ABSPATH' ) || exit;

foreach ( $items as $item_id => $item ) :
	$product       = $item->get_product();
	$sku           = '';
	$purchase_note = '';
	$image         = '';

	if ( ! apply_filters( 'woocommerce_order_item_visible', true, $item ) ) {
		continue;
	}

	if ( is_object( $product ) ) {
		$sku           = $product->get_sku();
		$purchase_note = $product->get_purchase_note();
		$image         = $product->get_image( $image_size );
	}

	?>
	<tr class="<?php echo esc_attr( apply_filters( 'woocommerce_order_item_class', 'order_item', $item, $order ) ); ?>">
		<td class="td font-family text-align-left" style="vertical-align: middle; word-wrap:break-word;">
			<table class="order-item-data">
				<tr>
					<?php
					// Show title/image etc.
					if ( $show_image ) {
						echo '<td>' . wp_kses_post( apply_filters( 'woocommerce_order_item_thumbnail', $image, $item ) ) . '</td>';
					}
					?>
					<td>
						<?php
						// Product name.
						echo wp_kses_post( apply_filters( 'woocommerce_order_item_name', $item->get_name(), $item, false ) );

						// SKU.
						if ( $show_sku && $sku ) {
							echo wp_kses_post( ' (#' . $sku . ')' );
						}

						// allow other plugins to add additional product information here.
						do_action( 'woocommerce_order_item_meta_start', $item_id, $item, $order, $plain_text );

						wc_display_item_meta( $item );

						// allow other plugins to add additional product information here.
						do_action( 'woocommerce_order_item_meta_end', $item_id, $item, $order, $plain_text );

						?>
					</td>
				</tr>
			</table>
		</td>
		<td class="td font-family text-align-right" style="vertical-align:middle;">
			<?php
			echo '&times;';
			$qty          = $item->get_quantity();
			$refunded_qty = $order->get_qty_refunded_for_item( $item_id );

			if ( $refunded_qty ) {
				$qty_display = '<del>' . esc_html( $qty ) . '</del> <ins>' . esc_html( $qty - ( $refunded_qty * -1 ) ) . '</ins>';
			} else {
				$qty_display = esc_html( $qty );
			}
			echo wp_kses_post( apply_filters( 'woocommerce_email_order_item_quantity', $qty_display, $item ) );
			?>
		</td>
		<td class="td font-family text-align-right" style="vertical-align:middle;">
			<?php echo wp_kses_post( $order->get_formatted_line_subtotal( $item ) ); ?>
		</td>
	</tr>
	<?php

	if ( $show_purchase_note && $purchase_note ) {
		?>
		<tr>
			<td colspan="3" class="font-family text-align-left" style="vertical-align:middle;">
				<?php
				echo wp_kses_post( wpautop( do_shortcode( $purchase_note ) ) );
				?>
			</td>
		</tr>
		<?php
	}
	?>

<?php endforeach; ?>
