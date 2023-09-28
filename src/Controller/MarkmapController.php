<?php

namespace App\Controller;

use App\Entity\Markmap;
use App\Repository\MarkmapRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/', name: "markmap_")]
class MarkmapController extends AbstractController
{
    #[Route('/{id?}', name: 'home')]
    public function index(?Markmap $markmap, EntityManagerInterface $em, MarkmapRepository $mr): Response
    {
        if (!$markmap)
        {
            $maps = $mr->findAll();
            if (!empty($maps))
            {
                $markmap = array_shift($maps);
            }
            else
            {
                $markmap = new Markmap();
                $em->persist($markmap);
                $em->flush();
            }

            $this->redirectToRoute('markmap_home', ['id' => $markmap->getId()]);
        }

        return $this->render('markmap/index.html.twig', [
            'currentMap' => $markmap,
        ]);
    }
}
