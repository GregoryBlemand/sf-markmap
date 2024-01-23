<?php

namespace App\Controller;

use App\Entity\Markmap;
use App\Repository\MarkmapRepository;
use Doctrine\ORM\EntityManagerInterface;
use phpDocumentor\Reflection\Types\This;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/', name: "markmap_")]
class MarkmapController extends AbstractController
{
    public function __construct(
        private readonly Security $security
    )
    {
    }

    #[Route('/{id?}', name: 'home', methods: ['GET'])]
    public function index(?Markmap $markmap, EntityManagerInterface $em, MarkmapRepository $mr): Response
    {
        $user = $this->security->getUser();

        if (!$user) {
            return $this->redirectToRoute('users_login');
        }
        // TODO récupérer les maps du user
        $maps = $mr->findAll();

        if (!$markmap)
        {
            if (!empty($maps))
            {
                $markmap = $maps[0];
            }
            else
            {
                $markmap = new Markmap();
                $markmap->setUser($user);

                $em->persist($markmap);
                $em->flush();
            }

            $this->redirectToRoute('markmap_home', ['id' => $markmap->getId()]);
        }

        return $this->render('markmap/index.html.twig', [
            'currentMap' => $markmap,
            'pages' => $maps
        ]);
    }

    #[Route('/maps', name: 'add', methods: ['POST'])]
    public function add(EntityManagerInterface $em) : JsonResponse
    {
        $markmap = new Markmap();
        $user = $this->security->getUser();
        $markmap->setUser($user);

        $em->persist($markmap);
        $em->flush();

        return $this->json([
            'result' => $markmap->getId(),
            'title' => $markmap->getTitle(),
            'content' => $markmap->getContent()
        ]);
    }

    #[Route('/maps/{id}', name: 'update', methods: ['GET', 'PATCH'])]
    public function update(Markmap $markmap, Request $request, EntityManagerInterface $em) : JsonResponse
    {
        if (! $markmap)
        {
            return $this->json([], Response::HTTP_NOT_FOUND);
        }

        if ($request->isMethod(Request::METHOD_PATCH))
        {
            $content = json_decode($request->getContent(), true);

            if (isset($content['content'])) {
                $markmap->setContent($content['content']);
            }

            if (isset($content['title'])) {
                $markmap->setTitle($content['title']);
            }

            $em->flush();
        }

        return $this->json([
            'result' => 'success',
            'title' => $markmap->getTitle(),
            'content' => $markmap->getContent()
        ]);
    }

    #[Route('/maps/{id}', name: 'delete', methods: ['GET', 'DELETE'])]
    public function delete(Markmap $markmap, EntityManagerInterface $em) : JsonResponse
    {
        if (! $markmap)
        {
            return $this->json([], Response::HTTP_NOT_FOUND);
        }

        $em->remove($markmap);
        $em->flush();

        return $this->json([
            'result' => 'deleted'
        ]);
    }
}
