<?php

/**
 * Example hooks for a Pico plugin
 *
 * @author Gilbert Pellegrom
 * @link http://pico.dev7studios.com
 * @license http://opensource.org/licenses/MIT

class Views 
{
	public function before_read_file_meta(&$headers)
	{
		$headers['view'] = 'View';
	}
	
	public function file_meta(&$meta)
	{
		if(isset($meta['view']) )
		{
			$meta['views'] = true;
			$meta['viewsfile'] = ROOT_DIR.'views/'.$meta['view'];
			if(file_exists(ROOT_DIR.'views/'.$meta['view']))
			{
				ob_start();
					include_once(ROOT_DIR.'views/'.$meta['view']);
				$meta['viewscontent'] = ob_get_clean();
			}
			else
			{
				$meta['viewscontent'] = '<p class="error" >Problem loading view '.$meta['view'].' in '.ROOT_DIR.'views/'.'</p>';
			}
		}
	}
}
 */
